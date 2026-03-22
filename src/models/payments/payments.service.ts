import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Customer } from '../../database/entities/customer.entity';
import { Route } from '../../database/entities/route.entity';
import { Transaction } from '../../database/entities/transaction.entity';
import { PaymentStatus } from '../../common/enums/route.enum';
import { Card } from '../../database/entities/card.entity';
import { Driver } from '../../database/entities/driver.entity';
import PaymentsConfig from './payment.config';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { CreateBankTokenDto } from './dto/create-bank-token.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,

    @InjectRepository(Route)
    private routeRepository: Repository<Route>,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Use a pinned, stable API version to avoid unexpected breaking changes at runtime
      apiVersion: '2022-11-15',
    } as any);
  }

  async createPaymentWithPaymentMethod(
    customerId: number,
    routeId: number,
    price: number,
    paymentMethodId: string,
  ): Promise<any> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const route = await this.routeRepository.findOne({ where: { id: routeId }, relations: ['customer'] });
    if (!route) throw new NotFoundException('Route not found');
    if (!route.customer || route.customer.id !== customerId) {
      throw new BadRequestException('Route does not belong to this customer');
    }

    // Ensure the payment method exists and belongs to this customer
    const card = await this.cardRepository.findOne({ where: { paymentMethodId }, relations: ['customer'] });
    if (!card) throw new NotFoundException('Card not found');
    if (!card.customer || card.customer.id !== customer.id) {
      throw new BadRequestException('Payment method does not belong to this customer');
    }

    const payment = await this.stripe.paymentIntents.create({
      amount: price * 100,
      currency: PaymentsConfig.CURRENCY,
      customer: card.stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    if (payment.status === 'succeeded') {
      const transaction = new Transaction();
      transaction.paymentId = payment.id;
      transaction.amount = payment.amount!;
      transaction.currency = payment.currency!;
      transaction.status = payment.status;
      transaction.createdAt = new Date();
      transaction.customer = customer;
      transaction.route = route;

      await this.transactionRepository.save(transaction);

      route.payment = PaymentStatus.PAYED

      await this.routeRepository.save(route)

      return PaymentStatus.PAYED
    }

    throw new BadRequestException('Payment failed');
  }

  async getCustomerTransactions(customerId: number) {
    return this.transactionRepository.find({
      where: { customer: { id: customerId } },
      relations: ['route'],
    });
  }

  async getTransaction(customerId: number, transactionId: number) {
    const tx = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['route', 'customer'],
    });
    if (!tx) throw new NotFoundException('Transaction not found');
    if (!tx.customer || tx.customer.id !== customerId) {
      throw new BadRequestException('Transaction does not belong to this customer');
    }
    return tx;
  }

  async createPaymentMethodFromToken(tokenId: string, customerId: number, status_default = false) {
    try {
      const customer = await this.customerRepository.findOne({ where: { id: customerId } });
      if (!customer) throw new NotFoundException('Customer not found');

      // Reuse existing Stripe customer if present; otherwise create a new one
      const existingCard = await this.cardRepository.findOne({ where: { customer: { id: customer.id } }, relations: ['customer'] });
      const stripeCustomerId = existingCard?.stripeCustomerId
        || (await this.stripe.customers.create({ email: customer.email })).id;

      // Create a payment method from the token
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: tokenId },
      });

      // Attach payment method to the customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: stripeCustomerId,
      });

      // Optionally set as default payment method on Stripe
      if (status_default) {
        await this.stripe.customers.update(stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethod.id,
          },
        });
      }

      const saved = await this.cardRepository.save({
        customer: customer,
        paymentMethodId: paymentMethod.id,
        stripeCustomerId: stripeCustomerId,
        brand: paymentMethod.card!.brand!,
        last4: paymentMethod.card!.last4!,
        exp_month: paymentMethod.card!.exp_month!,
        exp_year: paymentMethod.card!.exp_year!,
        funding: paymentMethod.card!.funding!,
        country: (paymentMethod.card as any)?.country ?? 'US',
        name: paymentMethod.billing_details?.name ?? 'N/A',
        default: !!status_default,
      });

      // Ensure only one default locally
      if (status_default) {
        await this.cardRepository.createQueryBuilder()
          .update()
          .set({ default: false })
          .where('customerId = :customerId AND id != :id', { customerId: customer.id, id: saved.id })
          .execute();
      }

      return paymentMethod;
    } catch (error) {
      throw error
    }
  }

  async getCustomerCards(customerId: number): Promise<Card[]> {
    return await this.cardRepository.find({ where: { customer: { id: customerId } } });
  }

  async getCard(customerId: number, cardId: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id: cardId }, relations: ['customer'] });
    if (!card) throw new NotFoundException('Card not found');
    if (!card.customer || card.customer.id !== customerId) {
      throw new BadRequestException('Card does not belong to this customer');
    }
    return card;
  }

  async changeStatusCard(customerId: number, cardId: number, defaultStatus: boolean): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id: cardId }, relations: ['customer'] });
    if (!card) throw new NotFoundException('Card not found');
    if (!card.customer || card.customer.id !== customerId) {
      throw new BadRequestException('Card does not belong to this customer');
    }

    // If making this card default, unset others and update Stripe
    if (defaultStatus) {
      await this.cardRepository.createQueryBuilder()
        .update()
        .set({ default: false })
        .where('customerId = :customerId AND id != :id', { customerId: card.customer?.id, id: cardId })
        .execute();

      // Update Stripe customer's default payment method
      if (card.stripeCustomerId && card.paymentMethodId) {
        await this.stripe.customers.update(card.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: card.paymentMethodId,
          },
        });
      }
    }

    await this.cardRepository.update({ id: cardId }, { default: defaultStatus });

    return await this.cardRepository.findOne({ where: { id: cardId } });
  }

  async deleteCard(customerId: number, cardId: number): Promise<boolean> {
    const card = await this.cardRepository.findOne({ where: { id: cardId }, relations: ['customer'] });
    if (!card) throw new NotFoundException('Card not found');
    if (!card.customer || card.customer.id !== customerId) {
      throw new BadRequestException('Card does not belong to this customer');
    }

    try {
      await this.stripe.paymentMethods.detach(card.paymentMethodId);
      await this.cardRepository.remove(card);
      return true;
    } catch (error) {
      throw new BadRequestException('Failed to delete card');
    }
  }


  // 🔹 Create a connected account and persist to driver
  async createConnectedAccount(driverId: number) {
    const driver = await this.driverRepository.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const account = await this.stripe.accounts.create({
      type: 'custom',
      country: 'US',
      email: driver.email || undefined,
      business_type: 'individual',
      capabilities: {
        transfers: { requested: true }
      }
    });

    await this.driverRepository.update({ id: driverId }, { paymentAccountId: account.id });

    return account.id
  }

  async completeOnboarding(driverId: number, body: CompleteOnboardingDto) {
    // Resolve accountId: use provided, or fallback to driver's saved paymentAccountId
    const driver = await this.driverRepository.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const resolvedAccountId = body.accountId || driver.paymentAccountId;

    if (!resolvedAccountId) {
      throw new BadRequestException('Stripe accountId is required. Create a connected account first.');
    }

    if (!body.tokenId) {
      throw new BadRequestException('Bank account tokenId is required');
    }

    const updateParams: Stripe.AccountUpdateParams = {};

    if (body.individual) {
      const ind: any = {};
      if (body.individual.first_name) ind.first_name = body.individual.first_name;
      if (body.individual.last_name) ind.last_name = body.individual.last_name;
      if (body.individual.ssn_last_4) ind.ssn_last_4 = body.individual.ssn_last_4;
      if (body.individual.phone) ind.phone = body.individual.phone;
      if (body.individual.email) ind.email = body.individual.email;
      if (body.individual.dob && (body.individual.dob.day || body.individual.dob.month || body.individual.dob.year)) {
        ind.dob = {
          ...(body.individual.dob.day ? { day: body.individual.dob.day } : {}),
          ...(body.individual.dob.month ? { month: body.individual.dob.month } : {}),
          ...(body.individual.dob.year ? { year: body.individual.dob.year } : {}),
        } as any;
      }
      if (body.individual.address) {
        ind.address = {
          ...(body.individual.address.line1 ? { line1: body.individual.address.line1 } : {}),
          ...(body.individual.address.city ? { city: body.individual.address.city } : {}),
          ...(body.individual.address.state ? { state: body.individual.address.state } : {}),
          ...(body.individual.address.postal_code ? { postal_code: body.individual.address.postal_code } : {}),
          ...(body.individual.address.country ? { country: body.individual.address.country } : {}),
        } as any;
      }
      (updateParams as any).individual = ind;
    }

    if (body.tos_acceptance && (body.tos_acceptance.date || body.tos_acceptance.ip)) {
      (updateParams as any).tos_acceptance = {
        ...(body.tos_acceptance.date ? { date: body.tos_acceptance.date } : {}),
        ...(body.tos_acceptance.ip ? { ip: body.tos_acceptance.ip } : {}),
      };
    }

    if (Object.keys(updateParams).length) {
      await this.stripe.accounts.update(resolvedAccountId, updateParams);
    }

    // Link external bank account to the connected account
    await this.stripe.accounts.createExternalAccount(resolvedAccountId, {
      external_account: body.tokenId,
    });

    return await this.driverRepository.update(
      { id: driverId },
      { paymentAccountId: resolvedAccountId, paymentVerified: true },
    );
  }

  // 🔹 Create bank account token for connecting external account
  async createBankAccountToken(body: CreateBankTokenDto) {
    const token = await this.stripe.tokens.create({
      bank_account: {
        country: body.country || 'US',
        currency: body.currency || PaymentsConfig.CURRENCY,
        account_holder_name: body.account_holder_name,
        account_holder_type: (body.account_holder_type as any) || 'individual',
        routing_number: body.routing_number,
        account_number: body.account_number,
      }
    } as any);
    return token;
  }

  async sendPayoutToDriver(driverAccountId: string, amount: number) {
    return await this.stripe.payouts.create({
      amount: Math.floor(amount * (1 - PaymentsConfig.PLATFORM_FEE / 100)),
      currency: PaymentsConfig.CURRENCY,
    }, {
      stripeAccount: driverAccountId
    });
    // return this.stripe.transfers.create({
    //   amount: Math.floor(amount * (1 - PaymentsConfig.PLATFORM_FEE / 100)),
    //   currency: PaymentsConfig.CURRENCY,
    //   destination: driverAccountId,
    // });
  }

  // 🔹 Get account info by ID
  async retrieveAccount(accountId: string) {
    return this.stripe.accounts.retrieve(accountId);
  }
}

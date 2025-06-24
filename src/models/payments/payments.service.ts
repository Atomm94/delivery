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
      apiVersion: '2025-05-28.basil' as any,
    });
  }

  async createPaymentWithPaymentMethod(
    customerId: number,
    routeId: number,
    price: number,
    paymentMethodId: string,
  ): Promise<any> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const route = await this.routeRepository.findOne({ where: { id: routeId } });
    if (!route) throw new NotFoundException('Route not found');

    const card = await this.cardRepository.findOne({ where: { paymentMethodId } });
    if (!card) throw new NotFoundException('Card not found');

    const payment = await this.stripe.paymentIntents.create({
      amount: price * 100,
      currency: 'usd',
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

  async getTransaction(transactionId: number) {
    return this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['route'],
    });
  }

  async createPaymentMethodFromToken(tokenId: string, customerId: number, status_default = false) {
    try {
      const customer = await this.customerRepository.findOne({ where: { id: customerId } });
      if (!customer) throw new NotFoundException('Customer not found');

      const stripeCustomer = await this.stripe.customers.create({ email: customer.email });

      // Create a payment method from the token
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: tokenId },
      });

      // Attach payment method to the customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: stripeCustomer.id,
      });

      // Set as default payment method (optional)
      await this.stripe.customers.update(stripeCustomer.id, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });

      await this.cardRepository.save({
        customer: customer,
        paymentMethodId: paymentMethod.id,
        stripeCustomerId: stripeCustomer.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
        funding: paymentMethod.card.funding,
        country: paymentMethod.card.country,
        name: paymentMethod.billing_details?.name ?? 'N/A',
        default: status_default,
      })

      return paymentMethod;
    } catch (error) {
      throw error
    }
  }

  async getCustomerCards(customerId: number): Promise<Card[]> {
    return await this.cardRepository.find({ where: { customer: { id: customerId } } });
  }

  async getCard(cardId: number): Promise<Card> {
    return await this.cardRepository.findOne({where: { id: cardId }});
  }

  async changeStatusCard(cardId: number, defaultStatus: boolean): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    await this.cardRepository.update(
      { id: cardId },
      { default: defaultStatus },
    );

    return await this.cardRepository.findOne({ where: { id: cardId } });
  }

  async deleteCard(cardId: number): Promise<boolean> {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    try {
      await this.stripe.paymentMethods.detach(card.paymentMethodId);
      await this.cardRepository.remove(card);
      return true;
    } catch (error) {
      throw new BadRequestException('Failed to delete card');
    }
  }


  // 🔹 Create a connected account (Express)
  async createConnectedAccount() {
    const account = await this.stripe.accounts.create({
      type: 'custom',
      country: 'US',
      email: 'driver@example.com',
      business_type: 'individual',
      capabilities: {
        transfers: { requested: true }
      }
    });

    // const accountLink = await this.stripe.accountLinks.create({
    //   account: account.id,
    //   refresh_url: `${process.env.HOSTING}/payment/onboarding/refresh`,
    //   return_url: `${process.env.HOSTING}/payment/onboarding/complete`,
    //   type: 'account_onboarding',
    // });



    return account.id
  }

  async completeOnboarding(accountId: string, driverId: number, tokenId: string) {
    // console.log('asssssssssssss');
    await this.stripe.accounts.update(accountId, {
      individual: {
        first_name: 'John',
        last_name: 'Mccartey',
        ssn_last_4: '0000',
        dob: { day: 1, month: 1, year: 1990 },
        phone: '+15555551234',
        email: 'driver@example.com',
        address: {
          line1: '123 Main St',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90001',
          country: 'US'
        }
      },
      // tos_acceptance: {
      //   date: Math.floor(Date.now() / 1000),
      //   ip: '127.0.0.1'
      // }
    });

    console.log(accountId);

    console.log(tokenId);

    await this.stripe.accounts.createExternalAccount(accountId, {
      external_account: tokenId,
    });

    return await this.driverRepository.update(
      { id: driverId },
      { paymentAccountId: accountId, paymentVerified: true },
    );
  }

  async sendPayoutToDriver(driverAccountId: string, amount: number) {
    return await this.stripe.payouts.create({
      amount: Math.floor(amount * (1 - PaymentsConfig.PLATFORM_FEE)),
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

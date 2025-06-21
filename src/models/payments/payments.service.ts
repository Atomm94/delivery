import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Customer } from '../../database/entities/customer.entity';
import { Route } from '../../database/entities/route.entity';
import { Transaction } from '../../database/entities/transaction.entity';
import { PaymentStatus } from '../../common/enums/route.enum';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository(Route)
    private routeRepository: Repository<Route>,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
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

    const stripeCustomer = await this.stripe.customers.create({ email: customer.email });

    // await this.stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomer.id });

    const payment = await this.stripe.paymentIntents.create({
      amount: price * 100,
      currency: 'usd',
      customer: stripeCustomer.id,
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

    return PaymentStatus.NOT_PAYED;
  }

  async getPaymentIntentDetails(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async getCustomerTransactions(customerId: number) {
    return this.transactionRepository.find({
      where: { customer: { id: customerId } },
      relations: ['route'],
    });
  }

  async getRouteTransactions(routeId: number) {
    return this.transactionRepository.find({
      where: { route: { id: routeId } },
      relations: ['customer'],
    });
  }

  async createPaymentMethodFromToken(tokenId: string, customerId: number) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    console.log(customer.email);

    const stripeCustomer = await this.stripe.customers.create({ email: customer.email });

    console.log('sssss');
    // Create a payment method from the token
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token: tokenId },
    });

    console.log('ssss3333333333');
    console.log(paymentMethod);


    // Attach payment method to the customer
    await this.stripe.paymentMethods.attach(paymentMethod.id, {
      customer: stripeCustomer.id,
    });

    console.log('ssss55555');

    // Set as default payment method (optional)
    await this.stripe.customers.update(stripeCustomer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    console.log('ppppppp');

    return paymentMethod;
  }
}

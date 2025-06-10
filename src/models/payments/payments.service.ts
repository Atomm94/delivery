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

  async createCheckoutSession(customerId: number, routeId: number, price: number) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const route = await this.routeRepository.findOne({ where: { id: routeId } });
    if (!route) throw new NotFoundException('Route not found');

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price * 100, // cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerId,
        routeId,
      },
      success_url: `${process.env.HOSTING}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.HOSTING}/cancel`,
    });

    return { url: session.url };
  }

  async handleCheckoutWebhook(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.metadata?.customerId;
      const routeId = session.metadata?.routeId;

      const customer = await this.customerRepository.findOne({ where: { id: Number(customerId) } });
      const route = await this.routeRepository.findOne({ where: { id: Number(routeId) } });

      if (!customer || !route) return;

      const transaction = new Transaction();
      transaction.stripeSessionId = session.id;
      transaction.amount = session.amount_total!;
      transaction.currency = session.currency!;
      transaction.status = session.payment_status;
      transaction.createdAt = new Date();
      transaction.customer = customer;
      transaction.route = route;

      await this.transactionRepository.save(transaction);

      route.payment = PaymentStatus.PAYED

      await this.routeRepository.save(route)
    }
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
}

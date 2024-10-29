import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from '../database/entities/card.entity';
import { Repository } from 'typeorm';
import { Customer } from '../database/entities/customer.entity';
import { CardDto } from '../common/DTOs/card.dto';
// import { Payment } from '../database/entities/payment.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Driver } from '../database/entities/driver.entity';
// import { Repository } from 'typeorm';
// import Stripe from 'stripe';

//
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}
//   public readonly stripe: Stripe;
//
//   constructor(
//     @InjectRepository(Driver)
//     private readonly driverRepository: Repository<Driver>,
//     @InjectRepository(Payment)
//     private readonly paymentRepository: Repository<Payment>,
//   ) {
//     this.stripe = new Stripe(this.process.env.STRIPE_SECRET_KEY);
//   }
//
//   async getUsers(phone_number: string): Promise<any> {
//     return this.stripe.customers.list({ phone_number });
//   }
//
//   async getPaymentMethods(userId: string): Promise<any> {
//     return this.stripe.paymentMethods.list({
//       user: userId,
//       type: 'card',
//     });
//   }
//
//   async getUser(phone_number: string): Promise<any> {
//     const user = await this.getUsers(phone_number)
//
//     if (!user.data.length) {
//       return await this.stripe.customers.create({ phone_number });
//     }
//
//     return user.data[0];
//   }
//
//   async saveCard(paymentMethodId: string, userId: string): Promise<any> {
//     await this.stripe.paymentMethods.attach(paymentMethodId, { user: userId });
//
//     return await this.stripe.customers.update(userId, {
//       invoice_settings: {
//         default_payment_method: paymentMethodId,
//       },
//     });
//   }
//
//   async checkout(userId: string, orderId: number, price: number): Promise<any> {
//     const session = await this.stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       customer: userId,
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               order: orderId,
//             },
//             unit_amount: price, // Amount in cents ex` 2000
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//     });
//
//     // Save session ID and customer ID to the database
//     const checkoutSession = this.paymentRepository.create({
//       sessionId: session.id,
//       createdAt: new Date(),
//       paymentStatus: 'success', // Initial status
//       userId,
//     });
//
//     await this.paymentRepository.save(checkoutSession);
//
//     return session.id;
//   }
//
//   async setDefault(userId: string, paymentMethodId: string): Promise<any> {
//     return await this.stripe.customers.update(userId, {
//       invoice_settings: {
//         default_payment_method: paymentMethodId,
//       },
//     });
//   }
//

  // Create a new card
  async create(customer: number, cardDto: CardDto): Promise<Card> {
    const createCard = Object.assign(customer, cardDto);
    const card = await this.cardRepository.create(createCard);
    return await this.cardRepository.save(card);
  }

  // Get all cards
  async getAll(customerId): Promise<Card[]> {
    return await this.cardRepository.find({ where: { customer: customerId } });
  }

  // Get a card by ID
  async getOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id }, relations: ['customer'] });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  // Update a card
  async updateCard(id: number, updateCardDto: CardDto): Promise<Card> {
    const card = await this.getOne(id); // Check if the card exists

    if (!card) {
      throw new NotFoundException(`Card is not found`);
    }

    await this.cardRepository.update(id, updateCardDto);
    return await this.getOne(id); // Return the updated card
  }
}

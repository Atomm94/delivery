import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags } from '@nestjs/swagger';
import { Card } from '../database/entities/card.entity';
import { CardDto } from '../common/DTOs/card.dto';

@ApiTags( 'payments' )
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

//   @Post('save-card')
//   async saveCard(@Res() response: Response, @Body() body) {
//     try {
//       const { phone_number, paymentMethodId } = body;
//
//       const user: any = await this.paymentsService.getUser(phone_number);
//
//       await this.paymentsService.saveCard(paymentMethodId, user.id)
//
//       return response.json({ success: true });
//     } catch (error) {
//       console.error('Error saving card:', error.message);
//       return response.status(500).json({ error: 'Failed to save card. Please try again.' });
//     }
//   }
//
//   @Post('create-checkout-session')
//   async createCheckoutSession(@Res() response: Response, @Body() body) {
//     try {
//       const { phone_number, orderId, price } = body;
//
//       const users = await this.paymentsService.getUsers(phone_number);
//       if (!users.data.length) {
//         return response.status(404).json({ error: 'Customer not found.' });
//       }
//
//       const user = users.data[0];
//
//       return response.send(await this.paymentsService.checkout(user.id, orderId, price));
//     } catch (error) {
//       console.error('Error creating checkout session:', error.message);
//       return response.status(500).json({ error: 'Failed to create checkout session. Please try again.' });
//     }
//   }
//
//   @Get('cards')
//   async getCards(@Res() response: Response, @Body() body) {
//     try {
//       const { phone_number } = body;
//
//       const users = await this.paymentsService.getUsers(phone_number);
//       if (!users.data.length) {
//         return response.status(404).json({ error: 'Customer not found.' });
//       }
//
//       const user = users.data[0];
//       // Retrieve saved payment methods for the customer
//       const paymentMethods = await this.paymentsService.getPaymentMethods(user.id);
//
//       return response.json(paymentMethods.data);
//     } catch (error) {
//       console.error('Error retrieving customer cards:', error.message);
//       return response.status(500).json({ error: 'Failed to retrieve cards. Please try again.' });
//     }
//   }
//
//   @Post('change-default-card')
//   async changeDefaultCard(@Res() response: Response, @Body() body) {
//     try {
//       const { phone_number, paymentMethodId } = body;
//
//       const users = await this.paymentsService.getUsers(phone_number);
//       if (!users.data.length) {
//         return response.status(404).json({ error: 'Customer not found.' });
//       }
//
//       const user = users.data[0];
//
//       await this.paymentsService.setDefault(user.id, paymentMethodId)
//
//       return response.json({ success: true });
//     } catch (error) {
//       console.error('Error changing default card:', error.message);
//       return response.status(500).json({ error: 'Failed to change default card. Please try again.' });
//     }
//   }

  // Create a new card
  @Post(':customerId')
  async createCard(@Param('customerId') customerId: number, @Body() cardDto: CardDto, @Res() res): Promise<Card> {
    return res.send(await this.paymentsService.create(customerId, cardDto));
  }

  // Get all cards
  @Get('/all/:customerId')
  async getAllCards(@Param('customerId') customerId: number, @Res() res): Promise<Card[]> {
    return res.send(await this.paymentsService.getAll(customerId));
  }

  // Get a card by ID
  @Get(':id')
  async getCardById(@Param('id') id: number, @Res() res): Promise<Card> {
    return res.send(await this.paymentsService.getOne(id));
  }

  // Update a card
  @Put(':id')
  async updateCard(@Param('id') id: number, @Body() updateCardDto: CardDto, @Res() res): Promise<Card> {
    return res.send(await this.paymentsService.updateCard(id, updateCardDto));
  }
}

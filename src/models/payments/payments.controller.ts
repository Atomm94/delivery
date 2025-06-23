import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  BadRequestException,
  ParseIntPipe,
  Query, Res,
  Delete, Put
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('Authorization')
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 🎯 Create Checkout Session
  @Post('create-checkout')
  @ApiBody({
    schema: {
      properties: {
        routeId: { type: 'integer', example: 1 },
        price: { type: 'integer', example: 1000 },
        paymentMethodId: { type: 'string' },
      },
    },
  })
  async createCheckout(
    @Req() req,
    @Res() res,
    @Body('routeId', ParseIntPipe) routeId: number,
    @Body('price', ParseIntPipe) price: number,
    @Body('paymentMethodId') paymentMethodId: string
  ) {
    if (!routeId || !price) {
      throw new BadRequestException('Missing required fields');
    }

    const { user: customer } = req;

    const payment = await this.paymentsService.createPaymentWithPaymentMethod(customer.id, routeId, price, paymentMethodId)

    return res.send({ message: 'checkout success', payment });
  }

  @Post('save-card')
  @ApiBody({
    schema: {
      properties: {
        tokenId: { type: 'string', example: 'tok_1234567890abcdef' },
        default: { type: 'boolean', example: 'true', default: true },
      },
    },
  })
  async saveCardToken(
    @Req() req,
    @Res() res,
    @Body() body: { tokenId: string, default: boolean },
  ) {
    try {
      const { user: customer } = req;

      const paymentMethod = await this.paymentsService.createPaymentMethodFromToken(
        body.tokenId,
        customer.id,
        body.default,
      );

      return res.send({ paymentMethodId: paymentMethod.id });
    } catch (error) {
      return res.send({ message: error.message });
    }
  }

  @Get('cards')
  async getCustomerCards(
    @Req() req,
    @Res() res,
  ) {
    const { user: customer } = req;

    return res.send({ cards: await this.paymentsService.getCustomerCards(customer.id) });
  }

  @Get('card/:id')
  async getCard(
    @Req() req,
    @Res() res,
    @Query('id') cardId: number,
  ) {
    return res.send(await this.paymentsService.getCard(cardId));
  }

  @Put('card/:id')
  @ApiBody({
    schema: {
      properties: {
        default: { type: 'boolean', example: 'true' },
      },
    },
  })
  async changeStatusCard(
    @Req() req,
    @Res() res,
    @Query('id') cardId: number,
    @Body() body: { default: boolean },
  ) {
    return res.send(await this.paymentsService.changeStatusCard(cardId, body.default));
  }

  @Delete('card/:id')
  async deleteCard(
    @Req() req,
    @Res() res,
    @Query('id') cardId: number,
  ) {
    return res.send(await this.paymentsService.deleteCard(cardId));
  }

  @Get('transactions')
  async getTransactions(
    @Req() req,
    @Res() res,
  ) {
    const { user: customer } = req;

    return res.send({ transactions: await this.paymentsService.getCustomerTransactions(customer.id) });
  }

  @Get('transaction/:id')
  async getTransaction(
    @Req() req,
    @Res() res,
    @Query('id') transactionId: number,
  ) {
    return res.send(await this.paymentsService.getTransaction(transactionId));
  }
}

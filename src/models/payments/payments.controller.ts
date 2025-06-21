import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Headers,
  HttpCode,
  BadRequestException,
  ParseIntPipe,
  Query, Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import Stripe from 'stripe';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 🎯 Create Checkout Session
  @ApiBearerAuth('Authorization')
  @Post('create-checkout')
  @ApiBody({
    schema: {
      properties: {
        customerId: { type: 'integer', example: 1 },
        routeId: { type: 'integer', example: 1 },
        price: { type: 'integer', example: 1000 },
        paymentMethodId: { type: 'string' },
      },
    },
  })
  async createCheckout(
    @Body('customerId', ParseIntPipe) customerId: number,
    @Body('routeId', ParseIntPipe) routeId: number,
    @Body('price', ParseIntPipe) price: number,
    @Body('paymentMethodId') paymentMethodId: string
  ) {
    if (!customerId || !routeId || !price) {
      throw new BadRequestException('Missing required fields');
    }

    return await this.paymentsService.createPaymentWithPaymentMethod(customerId, routeId, price, paymentMethodId);
  }

  @ApiBearerAuth('Authorization')
  @Post('save-card')
  async saveCardToken(
    @Req() req,
    @Res() res,
    @Body() body: { tokenId: string }
  ) {
    try {
      const { user: customer } = req;

      const paymentMethod = await this.paymentsService.createPaymentMethodFromToken(
        body.tokenId,
        customer.id,
      );
      return { success: true, paymentMethodId: paymentMethod.id };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('success')
  getCheckoutSuccess(@Query('session_id') sessionId: string) {
    return { message: 'Payment succeeded', sessionId };
  }

}

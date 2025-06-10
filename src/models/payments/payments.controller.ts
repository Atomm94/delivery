import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  HttpCode,
  BadRequestException,
  ParseIntPipe
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      properties: {
        customerId: { type: 'integer', example: 1 },
        routeId: { type: 'integer', example: 1 },
        price: { type: 'integer', example: 1000 },
      },
    },
  })
  async createCheckout(@Body('customerId', ParseIntPipe) customerId: number, @Body('routeId', ParseIntPipe) routeId: number, @Body('price', ParseIntPipe) price: number) {
    if (!customerId || !routeId || !price) {
      throw new BadRequestException('Missing required fields');
    }

    return await this.paymentsService.createCheckoutSession(customerId, routeId, price);
  }

  // 📡 Webhook to handle Stripe events (like payment success)
  @Post('webhook')

  @HttpCode(200)
  async handleStripeWebhook(@Req() req: Request, @Headers('stripe-signature') sig: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil' as any,
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody || req.body;
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      throw new BadRequestException('Invalid signature');
    }

    await this.paymentsService.handleCheckoutWebhook(event);
    return { received: true };
  }
}

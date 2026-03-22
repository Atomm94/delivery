import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  BadRequestException,
  ParseIntPipe,
  Param, Res,
  Delete, Put
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { SaveCardDto } from './dto/save-card.dto';
import { CreateBankTokenDto } from './dto/create-bank-token.dto';

@ApiBearerAuth('Authorization')
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 🎯 Create Checkout Session
  @Post('create-checkout')
  @ApiBody({ type: CreateCheckoutDto })
  async createCheckout(
    @Req() req,
    @Res() res,
    @Body() body: CreateCheckoutDto,
  ) {
    const { user: customer } = req;

    const payment = await this.paymentsService.createPaymentWithPaymentMethod(
      customer.id,
      body.routeId,
      body.price,
      body.paymentMethodId,
    );

    return res.send({ message: 'checkout success', payment });
  }

  @Post('save-card')
  @ApiBody({ type: SaveCardDto })
  async saveCardToken(
    @Req() req,
    @Res() res,
    @Body() body: SaveCardDto,
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
    @Param('id', ParseIntPipe) cardId: number,
  ) {
    const { user: customer } = req;
    return res.send(await this.paymentsService.getCard(customer.id, cardId));
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
    @Param('id', ParseIntPipe) cardId: number,
    @Body() body: { default: boolean },
  ) {
    const { user: customer } = req;
    return res.send(await this.paymentsService.changeStatusCard(customer.id, cardId, body.default));
  }

  @Delete('card/:id')
  async deleteCard(
    @Req() req,
    @Res() res,
    @Param('id', ParseIntPipe) cardId: number,
  ) {
    const { user: customer } = req;
    return res.send(await this.paymentsService.deleteCard(customer.id, cardId));
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
    @Param('id', ParseIntPipe) transactionId: number,
  ) {
    const { user: customer } = req;
    return res.send(await this.paymentsService.getTransaction(customer.id, transactionId));
  }

  @Post('create-account')
  async createAccount(
    @Req() req,
    @Res() res,
  ) {
    const { user: driver } = req;
    const accountId = await this.paymentsService.createConnectedAccount(driver.id);

    return res.json({
      message: 'Driver stripe account created successfully',
      accountId,
    });
  }

  @Post('create-bank-token')
  @ApiBody({ type: CreateBankTokenDto })
  async createBankToken(
    @Req() req,
    @Res() res,
    @Body() body: CreateBankTokenDto,
  ) {
    const token = await this.paymentsService.createBankAccountToken(body);
    return res.json({ tokenId: token.id });
  }

  @Post('complete-account')
  @ApiBody({ type: CompleteOnboardingDto })
  async completeAccount(
    @Req() req,
    @Res() res,
    @Body() body: CompleteOnboardingDto,
  ) {
    const { user: driver } = req;

    const account = await this.paymentsService.completeOnboarding(driver.id, body);

    return res.json({
      message: 'Driver stripe account completed successfully',
      account,
    });
  }
}

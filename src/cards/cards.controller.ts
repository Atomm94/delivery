import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardDto } from '../common/DTOs/card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async get(
    @Param('id') id: number,
    @Res() res,
  ) {
    return res.send(await this.cardsService.get(id));
  }

  @Post()
  async create(
    @Param('driverId') driverId: number,
    @Res() res,
    @Body() cardDto: CardDto,
  ) {
      const card = await this.cardsService.create(driverId, cardDto);

      return res.json({ message: 'Card successfully added', card });
  }
}

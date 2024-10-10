import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardDto } from '../common/DTOs/card.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags( 'cards' )
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService
  ) {}

  @Get('/:id')
  async get(
    @Param('id') driverId: number,
    @Res() res,
  ) {
    return res.send(await this.cardsService.getAll( { driverId, relations: ['drivers'] }));
  }

  @Post('/:id')
  async create(
    @Param('id') driverId: number,
    @Res() res,
    @Body() cardDto: CardDto,
  ) {
      const card = await this.cardsService.create(driverId, cardDto);

      return res.json({ message: 'Card successfully added', card });
  }
}

import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  getUser(@Req() req) {
    const { user } = req;

    return this.appService.getUserData(user);
  }
}

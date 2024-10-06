import { Controller, Delete, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  getUser(@Req() req) {
    const { user } = req;

    return this.appService.getUserData(user);
  }

  @Delete('/users')
  deleteUser(@Req() req, @Res() res) {
    const { user } = req;

    return this.appService.deleteUserData(user);
  }
}

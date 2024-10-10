import { Controller, Delete, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags( 'app' )
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  async getUser(@Req() req, @Res() res) {
    const { user } = req;

    return res.send(await this.appService.getUserData(user));
  }

  @Delete('/users')
  async deleteUser(@Req() req, @Res() res) {
    const { user } = req;

    return res.send(await this.appService.deleteUserData(user));
  }
}

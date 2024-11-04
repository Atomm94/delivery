import { Controller, Delete, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags( 'app' )
@Controller()
@ApiBearerAuth('Authorization')
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

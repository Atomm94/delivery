import { Controller, Delete, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { io } from 'socket.io-client';

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

  @Get('/tt')
  async ok(@Req() req, @Res() res) {

    const socket = io('http://143.198.145.57:3000/socket');

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket.id);
    });

    socket.on('message', (data) => {
      console.log('Message from server:', data);

      socket.emit('message', { driverId: 1, location: { latitude: 40.712776, longitude: -74.005974 } });

    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return res.send(socket.id);
  }
}

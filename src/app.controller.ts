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
    const socket = io('http://localhost:3000');

// Prepare location data
    const locationData = {
      driverId: '12345',
      location: {
        lat: 40.7128,
        lng: -74.0060
      }
    };

// Emit a message to the server with the location data
    socket.emit('message', locationData);

// Listen for the server's response (optional)
    socket.on('message', (data) => {
      console.log('Received message from server:', data);
    });

// Listen for error responses
    socket.on('error', (error) => {
      console.error('Error from server:', error.message);
    });

    return res.send(socket.id);
  }
}

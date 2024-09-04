import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SignInDto } from '../common/DTOs/auth.dto';
import { AuthService } from './auth.service';
import {ConfigService} from "@nestjs/config";

@Controller()
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @Post('signIn')
  async signIn(@Req() req, @Res() res, @Body() body: SignInDto) {
    try {
      const user = await this.authService.signIn(body);
      const token = jwt.sign({ id: user['id'] }, this.configService.get<string>('JWT_SECRET_KEY'));

      return res.json({ message: 'Signed in', user, token });
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }
}

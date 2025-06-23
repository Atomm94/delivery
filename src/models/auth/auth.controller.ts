import { Body, Controller, Post, Req, Res, Get } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SignInDto } from '../../common/DTOs/auth.dto';
import { AuthService } from './auth.service';
import {ConfigService} from "@nestjs/config";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags( 'auth' )
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @Post('signIn')
  @ApiOperation({
    summary: 'Sign in',
    description: 'Authenticate user and return user data with JWT',
  })
  async signIn(
    @Req() req,
    @Res() res,
    @Body() signInDto: SignInDto
  ) {
    try {
      const user = await this.authService.signIn(signInDto);
      const token = jwt.sign({ id: user['id'], role: user['role'], phone_number: user['phone_number'] }, this.configService.get<string>('JWT_SECRET_KEY'));

      return res.json({ message: 'Signed in', user, token });
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }

  @ApiBearerAuth('Authorization')
  @Get('firebase')
  @ApiOperation({
    summary: 'Get firebase token',
    description: 'Get user firebase token',
  })
  async getFirebaseToken(
    @Req() req,
    @Res() res,
    @Body('firebaseToken') firebaseToken: string,
  ) {
    try {
      const { id, role } = req.user;

      const data = await this.authService.getTokenByUserId(id, role)

      return res.json({ message: 'Firebase token updated successfully', data });
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }

  @ApiBearerAuth('Authorization')
  @Post('firebase')
  @ApiOperation({
    summary: 'Add firebase token',
    description: 'Update user firebase token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firebaseToken: { type: 'string', example: 'fcm_token_xyz' },
      },
      required: ['firebaseToken'],
    },
  })
  async addFirebaseToken(
    @Req() req,
    @Res() res,
    @Body('firebaseToken') firebaseToken: string,
  ) {
    try {
      const { id, role } = req.user;

      await this.authService.findOrUpdateTokenByUserId(id, role, firebaseToken)

      return res.json({ message: 'Firebase token updated successfully' });
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }
}

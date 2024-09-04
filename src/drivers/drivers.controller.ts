import {Body, Controller, Param, Post, Put, Req, Res} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { DriversService } from './drivers.service';
import { Driver } from '../database/entities/driver.entity';

@Controller('drivers')
export class DriversController {
    constructor(
        private readonly configService: ConfigService,
        private readonly driversService: DriversService,
    ) {}

    @Post('signUp')
    async signUp(@Req() req, @Res() res, @Body() body: Partial<Driver>) {

        const data = await this.driversService.create(body);
        const token = jwt.sign({ id: data.id }, this.configService.get<string>('JWT_SECRET_KEY'));

        return res.json({ message: 'Signed Up', data: { data, token } });
    }

    @Post('signIn')
    async signIn(@Req() req, @Res() res, @Body() body: Partial<Driver>) {
        try {
            const { phone_number } = body;
            const data = await this.driversService.getByPhone(phone_number);
            const token = jwt.sign({ id: data.id }, this.configService.get<string>('JWT_SECRET_KEY'));

            return res.json({ message: 'Signed in', data, token });
        } catch (error) {
            return res.status(400).json({
                statusCode: 400,
                timestamp: new Date().toISOString(),
                message: error.message,
            })
        }
    }

    @Put('update/:id')
    async update(@Param('id') id: number, @Res() res, @Body() body: Partial<Driver>) {
        try {
            const data = await this.driversService.update(id, body);

            return res.json({ message: 'Successfully updated', data });
        } catch (error) {
            return res.status(404).json({
                statusCode: 404,
                timestamp: new Date().toISOString(),
                message: error.message,
            })
        }
   }
}

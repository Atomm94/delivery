import {Body, Controller, Param, Post, Put, Req, Res} from '@nestjs/common';
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

        return res.json({ message: 'Signed Up', data: { data } });
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

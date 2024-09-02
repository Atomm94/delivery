import {Controller, Post, Req, Res} from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";

@Controller('customers')
export class CustomersController {
    constructor(private readonly configService: ConfigService) {}

    @Post('signUp')
    signUp(@Req() req, @Res() res) {
        const data = req.user;

        const token = jwt.sign(data, this.configService.get('JWT_SECRET_KEY'));

        return res.json({ message: 'Signed Up', data: { token } });
    }
}

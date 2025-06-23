import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {JwtMiddleware} from "./jwt/jwt.middleware";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../../database/entities/driver.entity';
import { Company } from '../../database/entities/company.entity';
import { Customer } from '../../database/entities/customer.entity';
import { UserToken } from '../../database/entities/user-token.entity';

@Module({
    imports: [
        JwtModule.register({
            secret: '1692334321984-9b2c6e4d',
            signOptions: { expiresIn: '1800s' },
        }),
        TypeOrmModule.forFeature([Driver, Company, Customer, UserToken]),
    ],
    providers: [AuthService],
    exports: [AuthService],
    controllers: [AuthController],
})

export class AuthModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware)
          .exclude(
            {path: 'drivers/signUp', method: RequestMethod.POST},
            {path: 'customers/signUp', method: RequestMethod.POST},
            {path: 'companies/signUp', method: RequestMethod.POST},
            {path: 'auth/signIn', method: RequestMethod.POST},
            {path: 'payments/success', method: RequestMethod.GET},
          )
          .forRoutes(
            {path: '*', method: RequestMethod.ALL},
          );
    }
}

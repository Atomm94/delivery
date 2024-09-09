import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {FirebaseMiddleware} from "./firebase/firebase.middleware";
import {JwtModule} from "@nestjs/jwt";
import {JwtMiddleware} from "./jwt/jwt.middleware";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../database/entities/driver.entity';
import { Company } from '../database/entities/company.entity';
import { Customer } from '../database/entities/customer.entity';

@Module({
    imports: [
        JwtModule.register({
            secret: '1692334321984-9b2c6e4d',
            signOptions: { expiresIn: '1800s' },
        }),
        TypeOrmModule.forFeature([Driver, Company, Customer]),
    ],
    providers: [AuthService],
    exports: [AuthService],
    controllers: [AuthController],
})

export class AuthModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(FirebaseMiddleware)
            .forRoutes(
                {path: '/bg/signUp', method: RequestMethod.POST},
            );

        // consumer.apply(JwtMiddleware)
        //   .exclude(
        //     {path: '/*/signUp', method: RequestMethod.POST},
        //     {path: '/*/signIn', method: RequestMethod.POST},
        //   )
        //   .forRoutes(
        //     {path: '*', method: RequestMethod.ALL},
        //   );
    }
}

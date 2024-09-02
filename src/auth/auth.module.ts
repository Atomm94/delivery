import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {FirebaseMiddleware} from "./firebase/firebase.middleware";
import {JwtModule} from "@nestjs/jwt";
import {JwtMiddleware} from "./jwt/jwt.middleware";
import { AuthService } from './auth.service';

@Module({
    imports: [
        JwtModule.register({
            secret: '1692334321984-9b2c6e4d',
            signOptions: { expiresIn: '1800s' },
        }),
    ],
    providers: [AuthService],
    exports: [AuthService],
})

export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(FirebaseMiddleware, JwtMiddleware)
            .forRoutes(
                {path: '/*/signUp', method: RequestMethod.POST},
                {path: '/^\\/signUp$/', method: RequestMethod.ALL},
            );
    }
}

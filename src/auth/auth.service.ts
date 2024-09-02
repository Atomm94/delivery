import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, newPassword: string): Promise<boolean> {
        return bcrypt.compare(newPassword, password);
    }
}

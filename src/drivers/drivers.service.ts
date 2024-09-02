import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DriverEntity} from "../database/entities/driver.entity";
import {Repository} from "typeorm";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(DriverEntity)
        private readonly driverRepository: Repository<DriverEntity>,
        private readonly authService: AuthService,
    ) {}

    async getByPhone(phone_number: string): Promise<DriverEntity> {
        const driver = await this.driverRepository.findOneBy({ phone_number });

        if (!driver) {
            throw new Error('Invalid phone number');
        }

        return driver;
    }

    async create(driverData: Partial<DriverEntity>): Promise<DriverEntity> {
        driverData.password = await this.authService.hashPassword(driverData.password);

        return await this.driverRepository.save(driverData);
    }

    async update(id: number, updateData: Partial<DriverEntity>): Promise<DriverEntity> {
        const { affected } = await this.driverRepository
            .createQueryBuilder()
            .update(DriverEntity)
            .set(updateData)
            .where("id = :id", { id })
            .execute();

        if (!affected) {
            throw new Error('Driver not found');
        }

        return await this.driverRepository.findOneBy({ id });
    }
}
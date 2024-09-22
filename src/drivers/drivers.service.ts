import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Driver} from "../database/entities/driver.entity";
import {Repository} from "typeorm";
import {AuthService} from "../auth/auth.service";
import { CompleteDriverDataDto } from '../common/DTOs/driver.dto';
import { dtoToPartialDriverEntity } from '../common/helpers/dtoToPartialEntity';

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private readonly driverRepository: Repository<Driver>,
        private readonly authService: AuthService,
    ) {}


    async getByPhone(phone_number: string): Promise<Driver> {
        return await this.driverRepository.findOne({ where: { phone_number } });
    }

    async create(driverData: Partial<Driver>): Promise<Driver> {
        const driver = await this.driverRepository.findOne({
            where: { phone_number: driverData.phone_number }
        });

        if (driver) {
            throw new ConflictException('phone number is already exists');
        }

        driverData.password = await this.authService.hashPassword(driverData.password);

        return await this.driverRepository.save(driverData);
    }

    async update(id: number, completeDataDto: CompleteDriverDataDto): Promise<Driver> {
        const updateData = dtoToPartialDriverEntity(completeDataDto);

        const { affected } = await this.driverRepository
            .createQueryBuilder()
            .update(Driver)
            .set(updateData)
            .where("id = :id", { id })
            .execute();

        if (!affected) {
            throw new NotFoundException('Driver not found');
        }

        return await this.driverRepository.findOneBy({ id });
    }
}

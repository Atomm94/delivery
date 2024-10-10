import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Driver} from "../database/entities/driver.entity";
import {Repository} from "typeorm";
import {AuthService} from "../auth/auth.service";
import { CompleteDriverDataDto, UpdateDataDto } from '../common/DTOs/driver.dto';
import { completeDtoToPartialDriverEntity, updateDtoToPartialDriverEntity } from '../common/helpers/dtoToPartialEntity';

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private readonly driverRepository: Repository<Driver>,
        private readonly authService: AuthService,
    ) {}


    async get(condition: any): Promise<Driver> {
        return await this.driverRepository.findOne({ where: condition });
    }

    async getAll(condition: any): Promise<Driver[]> {
        return await this.driverRepository.find({ where: condition });
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

    async complete(id: number, completeDataDto: CompleteDriverDataDto): Promise<Driver> {
        const updateData = completeDtoToPartialDriverEntity(completeDataDto);

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

    async update(id: number, updateDataDto: UpdateDataDto): Promise<Driver> {
        const updateData = updateDtoToPartialDriverEntity(updateDataDto);

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

    async doRate(id: number, rateData: any) {
        const { rate } = rateData;
        const driver = await this.driverRepository.findOne({ where: { id } });

        if (!driver) {
            throw new NotFoundException('Driver is not found');
        }

        if (!driver.rate) {
            driver.rate = rate;
        } else {
            driver.rate = Math.ceil((driver.rate + rate) / 2);
        }

        await this.driverRepository.save(driver);

        return driver.rate;
    }
}

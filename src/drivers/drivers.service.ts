import {Injectable} from "@nestjs/common";
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


    async create(driverData: Partial<Driver>): Promise<Driver> {
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
            throw new Error('Driver not found');
        }

        return await this.driverRepository.findOneBy({ id });
    }
}

import { ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../../database/entities/driver.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CompleteDriverDataDto, DriverVerifyCode, UpdateDataDto } from '../../common/DTOs/driver.dto';
import {
    completeDtoToPartialDriverEntity,
    updateDtoToPartialDriverEntity,
} from '../../common/helpers/dtoToPartialEntity';
import { Route } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { PaymentStatus, Status } from '../../common/enums/route.enum';
import { Truck } from '../../database/entities/truck.entity';
import { GeoGateway } from '../geo/geo.gateway';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { DriverStatusEnum } from '../../common/enums/driver-status.enum';
import { UserToken } from '../../database/entities/user-token.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import firebaseNotification from '../auth/firebase/firebase.notification';
import { PaymentsService } from '../payments/payments.service';
import { RateDto } from '../../common/DTOs/rate.dto';
import { Customer } from '../../database/entities/customer.entity';
import { Rate } from '../../database/entities/rate.entity';

@Injectable()
export class DriversService {
    private twilioClient: Twilio;

    constructor(
        @InjectRepository(UserToken)
        private readonly userTokenRepository: Repository<UserToken>,
        @InjectRepository(Driver)
        private readonly driverRepository: Repository<Driver>,
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        @InjectRepository(Rate)
        private readonly rateRepository: Repository<Rate>,
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Truck)
        private readonly truckRepository: Repository<Truck>,
        private readonly paymentsService: PaymentsService,
        private readonly authService: AuthService,
        private readonly geoGateway: GeoGateway,
        private configService: ConfigService
    ) {
        this.twilioClient = new Twilio(
          this.configService.get('TWILIO_ACCOUNT_SID'),
          this.configService.get('TWILIO_AUTH_TOKEN'),
        );
    }


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

        // const checkCompanyDriver = await this.companyDriverRepository.findOne({
        //     where: { phone_number: driverData.phone_number }
        // });
        //
        // if (checkCompanyDriver) {
        //     const companyId: any = checkCompanyDriver.companyId
        //     driverData.company = companyId
        // }

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

    async getRate(driverId: number): Promise<any> {
        const driver = await this.driverRepository.findOne({ where: { id: driverId }, relations: ['ratings'] });

        if (!driver) {
            throw new NotFoundException('Driver is not found');
        }

        const rates: any[] = driver.ratings

        if (rates.length === 0) {
            return { averageRate: 0, rates };
        }

        const averageRate = rates.reduce((sum, rate) => sum + rate.star, 0) / rates.length;

        return { averageRate };
    }

    async startRoute(driverId: number, routeId: number): Promise<any> {
        try {
            const driver = await this.driverRepository.findOne({ where: { id: driverId } });

            if (!driver) {
                throw new NotFoundException('Driver is not found');
            }

            //TODO
            let route = await this.routeRepository.findOne({
                where: {
                    id: routeId,
                    payment: PaymentStatus.PAYED,
                    status: Status.ON_HOLD as Status,
                }, relations: ['customer'],
            });

            if (!route) {
                throw new NotFoundException('Route is / not payed / not in progress / not found');
            }

            await this.driverRepository.update(
              { id: driverId },
              { status: DriverStatusEnum.ON_TRIP as DriverStatusEnum },
            )

            await this.routeRepository.update(
              { id: routeId },
              { status: Status.IN_PROGRESS as Status },
            )

            const customer = await this.userTokenRepository.findOne({ where: { userId: route.customer.id, role: UserRole.CUSTOMER } });

            if (!customer) {
                throw new NotFoundException('Token for this user is not found');
            }

            await firebaseNotification(customer.token, 'route alert', 'Your route is on the way');

            return route;
        }catch (e) {
            return e.message;
        }
    }

    async dropOff(driverId: number, orderId: number): Promise<any> {
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });

        if (!driver) {
            throw new NotFoundException('Driver is not found');
        }

        let order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: [
              'route',
              'route.customer'
            ]
        });

        if (!order) {
            throw new NotFoundException('Order is not found');
        }

        // TODO
        // await this.sendCode(order.route.customer.phone_number, order.verify_code);

        return order;
    }

    async resendCode(phone_number: string, verify_code: string): Promise<any> {
        await this.sendCode(phone_number, verify_code);
    }

    async verifyCode(driverId: number, driverVerifyCode: DriverVerifyCode): Promise<any> {
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });

        if (!driver) {
            throw new NotFoundException('Driver is not found');
        }


        let order = await this.orderRepository.findOne({ where: { verify_code: driverVerifyCode.verify_code } });

        if (!order) {
            throw new NotFoundException('Invalid code');
        }

        order.verify_code = null;

        await this.orderRepository.save(order);

        return { msg: 'success' };
    }

    async doneRoute(driverId: number, routeId: number): Promise<any> {
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });

        if (!driver) {
            throw new NotFoundException('Driver is not found');
        }

        let route = await this.routeRepository.findOne({ where: { id: routeId, payment: PaymentStatus.PAYED } });

        if (!route) {
            throw new NotFoundException('Route is not found');
        }

        await this.driverRepository.update(
          { id: driverId },
          { status: DriverStatusEnum.AVAILABLE as DriverStatusEnum },
        )

        await this.routeRepository.update(
          { id: routeId },
          { status: Status.DONE as Status },
        );

        // return await this.paymentsService.sendPayoutToDriver(driver.paymentAccountId, route.price)

        return { msg: 'success' };
    }

    private async sendCode(phoneNumber: string, code: string): Promise<any> {
        await this.twilioClient.messages.create({
            body: `Your verification code is: ${code}`,
            from: this.configService.get('TWILIO_PHONE_NUMBER'),
            to: phoneNumber,
        });

        return { msg: 'success' };
    }

    async doRate(driverId: number, customerId: number, rateDto: RateDto): Promise<any> {
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });

        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        const customer = await this.customerRepository.findOne({ where: { id: customerId } });

        if (!customer) {
            throw new NotFoundException('Customer is not found');
        }

        Object.assign(rateDto, { customer: customerId });

        return await this.rateRepository.save(rateDto);
    }
}

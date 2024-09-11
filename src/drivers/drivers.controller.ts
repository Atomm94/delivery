import {
    Body,
    Controller,
    Param,
    Post,
    Put,
    Req,
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DriversService } from './drivers.service';
import { CompleteDataDto, SignUpDto } from '../common/DTOs/driver.dto';
import { DriverFileInterceptor } from '../interceptors/driver.file.interceptor';

@Controller('drivers')
export class DriversController{
    constructor(
        private readonly configService: ConfigService,
        private readonly driversService: DriversService,
    ) {}

    @Post('signUp')
    async signUp(@Req() req, @Res() res, @Body() signUpDto: SignUpDto) {
        const data = await this.driversService.create(signUpDto);

        return res.json({ message: 'Signed Up', data: { data } });
    }

    @Put('complete/:id')
    @UseInterceptors(DriverFileInterceptor)
    async update(
      @Param('id') id: number,
      @Res() res,
      @Body() completeDataDto: CompleteDataDto,
      @UploadedFiles() files: any,
    ) {
        try {
            //console.log(completeDataDto, 'ok driver data...');
            const { trucks, ...driverData } = completeDataDto;

            //console.log('trucks', trucks);
            //console.log('driverData', driverData);
            //console.log('files', files);
            for (const key in files) {
                console.log(key.split(''));
                if (key.split('').includes('trucks')) {
                    console.log(files[key]);
                }
            }
            // console.log('License File:', files['license']);
            // console.log('Identity File:', files['identity']);
            // console.log('Vehicle Titles:', files['trucks[0][vehicle_title][]']);
            // console.log('Insurances:', files['trucks[0][insurances][]']);
            // console.log('Photos:', files['trucks[0][photos][]']);

            //const data = await this.driversService.update(id, completeDataDto);

            return res.json({ message: 'Successfully updated', msg: 'data' });
        } catch (error) {
            return res.status(404).json({
                statusCode: 404,
                timestamp: new Date().toISOString(),
                message: error.message,
            })
        }
   }
}

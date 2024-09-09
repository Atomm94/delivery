import {
    Body,
    Controller,
    Param,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DriversService } from './drivers.service';
import { CompleteDataDto, SignUpDto } from '../common/DTOs/driver.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('drivers')
export class DriversController {
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
    @UseInterceptors(
      FileInterceptor('license', { dest: './uploads' }), // Single file upload
      FileInterceptor('identity', { dest: './uploads' }), // Single file upload
      FilesInterceptor('trucks[0][vehicle_title][]', 10, { dest: './uploads' }), // Multiple files under vehicle_title
      FilesInterceptor('trucks[0][insurances][]', 10, { dest: './uploads' }), // Multiple files under insurances
      FilesInterceptor('trucks[0][photos][]', 10, { dest: './uploads' }), // Multiple files under photos
    )
    async update(
      @Param('id') id: number,
      @Res() res,
      @Body() completeDataDto: CompleteDataDto,
      @UploadedFile('license') license: Express.Multer.File,
      @UploadedFile('identity') identity: Express.Multer.File,
      @UploadedFiles('trucks[0][vehicle_title][]') vehicleTitles: Express.Multer.File[],
      @UploadedFiles('trucks[0][insurances][]') insurances: Express.Multer.File[],
      @UploadedFiles('trucks[0][photos][]') photos: Express.Multer.File[],
    ) {
        try {

            console.log(completeDataDto, 'ok driver data...');
            console.log('License File:', license);
            console.log('Identity File:', identity);
            console.log('Vehicle Titles:', vehicleTitles);
            console.log('Insurances:', insurances);
            console.log('Photos:', photos);

            const data = await this.driversService.update(id, completeDataDto);

            return res.json({ message: 'Successfully updated', data });
        } catch (error) {
            return res.status(404).json({
                statusCode: 404,
                timestamp: new Date().toISOString(),
                message: error.message,
            })
        }
   }
}

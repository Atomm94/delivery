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
import { CompleteDriverDataDto, SignUpDto } from '../common/DTOs/driver.dto';
import { DriverFilesInterceptor } from '../interceptors/driver.files.interceptor';
import { getFileUrl, removeFiles } from '../configs/multer.config';

@Controller('drivers')
export class DriversController{
    constructor(
        private readonly configService: ConfigService,
        private readonly driversService: DriversService,
    ) {}

    @Post('signUp')
    async signUp(@Req() req, @Res() res, @Body() signUpDto: SignUpDto) {
        const driver = await this.driversService.getByPhone(signUpDto.phone_number);

        if (!driver) {
            return res.status(400).json({ message: 'phone number is exists' })
        }

        const data = await this.driversService.create(signUpDto);

        return res.json({ message: 'Signed Up', data: { data } });
    }

    @Put('complete/:id')
    @UseInterceptors(DriverFilesInterceptor)
    async update(
      @Param('id') id: number,
      @Res() res,
      @Body() completeDataDto: CompleteDriverDataDto,
      @UploadedFiles() files: any,
    ) {
        try {
            Object.entries(files).forEach(([key, value]) => {
                completeDataDto[value['fieldname']] = getFileUrl(value['filename']);
            })

            const data = await this.driversService.update(id, completeDataDto);

            return res.json({ message: 'Successfully updated', data });
        } catch (error) {
            //await removeFiles(files)

            return res.status(404).json({
                statusCode: 404,
                timestamp: new Date().toISOString(),
                message: error.message,
            })
        }
   }
}

import {
    Body,
    Controller,
    Post,
    Put,
    Req,
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DriversService } from './drivers.service';
import { CompleteDriverDataDto, DriversSignUpDto, UpdateDataDto } from '../../common/DTOs/driver.dto';
import { getFileUrl } from '../../configs/multer.config';
import { removeFiles } from '../../common/helpers/filePaths';
import { FilesInterceptor } from '../../interceptors/files.interceptor';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags( 'drivers' )
@Controller('drivers')
export class DriversController{
    constructor(
        private readonly configService: ConfigService,
        private readonly driversService: DriversService,
    ) {}

    @Post('signUp')
    @ApiConsumes('application/json')
    async signUp(@Req() req, @Res() res, @Body() signUpDto: DriversSignUpDto) {
        const data = await this.driversService.create(signUpDto);

        return res.json({ message: 'Signed Up', data: { data } });
    }

    @Put('complete')
    @ApiBearerAuth('Authorization')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor)
    @ApiBody({ type: CompleteDriverDataDto })
    async complete(
      @Req() req,
      @Res() res,
      @Body() completeDataDto: CompleteDriverDataDto,
      @UploadedFiles() files: any,
    ) {
        try {
            if (files) {
                Object.entries(files).forEach(([key, value]) => {
                    completeDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
                })
            }

            const { user: driver } = req;

            const data = await this.driversService.complete(driver.id, completeDataDto);

            return res.json({ message: 'Successfully completed', data });
        } catch (error) {
            await removeFiles(files)

            return res.status(404).json({
                statusCode: 404,
                timestamp: new Date().toISOString(),
                message: error.message,
            })
        }
   }

   @Put()
   @ApiBearerAuth('Authorization')
   @ApiConsumes('multipart/form-data')
   @UseInterceptors(FilesInterceptor)
   @ApiBody({ type: UpdateDataDto })
   async update(
     @Req() req,
     @Res() res,
     @Body() updateDataDto: UpdateDataDto,
     @UploadedFiles() files: any,
   ) {
      try {
          if (files) {
              Object.entries(files).forEach(([key, value]) => {
                  updateDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
              })
          }

          const { user: driver } = req;

          const data = await this.driversService.update(driver.id, updateDataDto);

          return res.json({ message: 'Successfully updated', data });
      } catch (error) {
          await removeFiles(files)

          return res.status(404).json({
              statusCode: 404,
              timestamp: new Date().toISOString(),
              message: error.message,
          })
      }
   }

   @Put('rate')
   @ApiConsumes('multipart/form-data')
   @ApiBearerAuth('Authorization')
   async doRate(
     @Req() req,
     @Res() res,
     @Body() rateDto: number,
   ) {
        const { user: driver } = req;

        const rate = await this.driversService.doRate(driver.id, rateDto);

        return res.json({ rate })
   }
}

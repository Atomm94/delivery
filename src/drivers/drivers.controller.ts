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
import { CompleteDriverDataDto, SignUpDto, UpdateDataDto } from '../common/DTOs/driver.dto';
import { getFileUrl } from '../configs/multer.config';
import { removeFiles } from '../common/helpers/filePaths';
import { FilesInterceptor } from '../interceptors/files.interceptor';

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
    @UseInterceptors(FilesInterceptor)
    async complete(
      @Param('id') id: number,
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

            const data = await this.driversService.complete(id, completeDataDto);

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

   @Put('/:id')
   @UseInterceptors(FilesInterceptor)
   async update(
     @Param('id') id: number,
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

          const data = await this.driversService.update(id, updateDataDto);

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
}

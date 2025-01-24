import {
  Body,
  Controller, Get, Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DriversService } from './drivers.service';
import { CompleteDriverDataDto, DriversSignUpDto, RateDto, UpdateDataDto } from '../../common/DTOs/driver.dto';
import { getFileUrl } from '../../configs/multer.config';
import { removeFiles } from '../../common/helpers/filePaths';
import { FilesInterceptor } from '../../interceptors/files.interceptor';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

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

  @Get('rate')
  @ApiBearerAuth('Authorization')
  async getRate(
    @Req() req,
    @Res() res
  ) {
    const { user: driver } = req;

    const rate = await this.driversService.getRate(driver.id);

    return res.json({ rate })
  }

  @Post('start/:routeId/:truckId')
  @ApiOperation({ summary: 'connect driver to route' })
  @ApiBearerAuth('Authorization')
  async startRoute(
    @Req() req,
    @Res() res,
    @Param('routeId') routeId: number,
    @Param('truckId') truckId: number
  ) {
    const { user: driver } = req;

    const route = await this.driversService.startRoute(driver.id, routeId, truckId);

    return res.send({ route })
  }
}

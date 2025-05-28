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
import { RouteService } from '../routes/route.service';
import {
  CompleteDriverDataDto,
  DriversSignUpDto,
  UpdateDataDto,
  DriverVerifyCode,
  DriverTakeRouteDto,
} from '../../common/DTOs/driver.dto';
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
        private readonly routeService: RouteService,
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

  @Post('take')
  @ApiOperation({ summary: 'connect driver to route' })
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: DriverTakeRouteDto })
  async takeRoute(
    @Req() req,
    @Res() res,
    @Body() driverTakeRoute: DriverTakeRouteDto
  ) {
    const { user } = req;

    const route = await this.routeService.takeRoute(user, driverTakeRoute);

    return res.send({ route })
  }

  @Put('start/:routeId')
  @ApiOperation({ summary: 'driver start route' })
  @ApiBearerAuth('Authorization')
  async startRoute(
    @Req() req,
    @Res() res,
    @Param('routeId') routeId: number
  ) {
    const { user: driver } = req;

    const route = await this.driversService.startRoute(driver.id, routeId);

    return res.send({ route })
  }

  @Put('dropOff/:orderId')
  @ApiOperation({ summary: 'driver drop off' })
  @ApiBearerAuth('Authorization')
  async dropOff(
    @Req() req,
    @Res() res,
    @Param('orderId') orderId: number
  ) {
    const { user: driver } = req;

    const order = await this.driversService.dropOff(driver.id, orderId);

    return res.send({ order })
  }


  @Post('verifyCode')
  @ApiOperation({ summary: 'verify code' })
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: DriverVerifyCode })
  async verifyCode(
    @Req() req,
    @Res() res,
    @Body() driverVerifyCode: DriverVerifyCode,
  ) {
    const { user: driver } = req;

    const response = await this.driversService.verifyCode(driver.id, driverVerifyCode);

    return res.send(response)
  }

  @Post('resendCode')
  @ApiOperation({ summary: 'resend code' })
  @ApiBearerAuth('Authorization')
  @ApiBody({ schema: { properties: { phone_number: { type: 'string' }, verify_code: { type: 'string' } } } })
  async resendCode(
    @Req() req,
    @Res() res,
    @Body() phone_number: string,
    @Body() verify_code: string,
  ) {
    const response = await this.driversService.resendCode(phone_number, verify_code);

    return res.send(response)
  }

  @Put('done/:routeId')
  @ApiOperation({ summary: 'driver finish' })
  @ApiBearerAuth('Authorization')
  async doneRoute(
    @Req() req,
    @Res() res,
    @Param('routeId') routeId: number,
  ) {
    const { user: driver } = req;

    const route = await this.driversService.doneRoute(driver.id, routeId);

    return res.send({ route })
  }
}

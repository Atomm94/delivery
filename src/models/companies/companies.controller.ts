import { Body, Controller, Post, Put, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CompanyMultipleDriverDto,
  CompanySignUpDto, CompanyTakeRouteDto,
  CompleteCompanyDataDto,
  UpdateCompanyDataDto,
} from '../../common/DTOs/company.dto';
import { CompaniesService } from './companies.service';
import { FilesInterceptor } from '../../interceptors/files.interceptor';
import { getFileUrl } from '../../configs/multer.config';
import { removeFiles } from '../../common/helpers/filePaths';
import { RouteService } from '../routes/route.service';

@ApiTags( 'companies' )
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly routeService: RouteService,
  ) {}

  @Post('signUp')
  @ApiConsumes('application/json')
  async signUp(@Req() req, @Res() res, @Body() signUpDto: CompanySignUpDto) {
    const data = await this.companiesService.create(signUpDto);

    return res.json({ message: 'Signed Up', data: { data } });
  }

  @Post('drivers')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Register new drivers' })
  @ApiBody({ type: CompanyMultipleDriverDto })
  async createDrivers(
    @Body() companyMultipleDriverDto: CompanyMultipleDriverDto,
    @Req() req,
  ): Promise<any> {
    const { user: company } = req;
    return await this.companiesService.createCompanyDrivers(company.id, companyMultipleDriverDto);
  }

  @Put('complete')
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor)
  @ApiBody({ type: CompleteCompanyDataDto })
  async complete(
    @Req() req,
    @Res() res,
    @Body() completeDataDto: CompleteCompanyDataDto,
    @UploadedFiles() files: any,
  ) {
    try {
      if (files) {
        Object.entries(files).forEach(([key, value]) => {
          completeDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
        })
      }

      const { user: company } = req;

      const data = await this.companiesService.complete(company.id, completeDataDto);

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
  @ApiBody({ type: UpdateCompanyDataDto })
  async update(
    @Req() req,
    @Res() res,
    @Body() updateDataDto: UpdateCompanyDataDto,
    @UploadedFiles() files: any,
  ) {
    try {
      if (files) {
        Object.entries(files).forEach(([key, value]) => {
          updateDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
        })
      }

      const { user: company } = req;

      const data = await this.companiesService.update(company.id, updateDataDto);

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

  @Post('take')
  @ApiOperation({ summary: 'connect route to driver' })
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: CompanyTakeRouteDto })
  async takeRoute(
    @Req() req,
    @Res() res,
    @Body() companyTakeRouteDto: CompanyTakeRouteDto,
  ) {
    const { user } = req;

    const route = await this.routeService.takeRoute(user, companyTakeRouteDto);

    return res.send({ route })
  }
}

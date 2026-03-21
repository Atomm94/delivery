import { Body, Controller, Get, Post, Put, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
// Note: Auth guard import removed as guard is not present in the project

@ApiTags( 'companies' )
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly routeService: RouteService,
  ) {}

  @Post('signUp')
  @ApiConsumes('application/json')
  @ApiBody({ type: CompanySignUpDto })
  async signUp(@Req() req, @Res() res, @Body() signUpDto: CompanySignUpDto) {
    const data = await this.companiesService.create(signUpDto as any);
    return res.json({ message: 'Signed Up', data });
  }

  @Post('complete')
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: CompleteCompanyDataDto })
  async complete(
    @Req() req,
    @Res() res,
    @Body() completeDataDto: CompleteCompanyDataDto,
  ) {
    try {
      const { user: company } = req;
      const data = await this.companiesService.complete(company.id, completeDataDto);

      return res.json({ message: 'Successfully completed', data });
    } catch (error) {
      return res.status(404).json({
        statusCode: 404,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }

  @Post('drivers')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Register new drivers' })
  @UseInterceptors(FilesInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CompanyMultipleDriverDto })
  async createDrivers(
    @Body() companyMultipleDriverDto: CompanyMultipleDriverDto,
    @Req() req,
    @UploadedFiles() files: any,
  ): Promise<any> {
    const { user: company } = req;

    // If drivers came as a JSON string in multipart body, parse it
    if (!Array.isArray(companyMultipleDriverDto?.drivers) && typeof req?.body?.drivers === 'string') {
      try {
        const parsed = JSON.parse(req.body.drivers);
        if (Array.isArray(parsed)) {
          (companyMultipleDriverDto as any).drivers = parsed;
        }
      } catch (_) {
        // ignore JSON parse error; validation will handle bad payloads
      }
    }

    // Map uploaded files to corresponding driver fields (license can be multiple)
    if (files && companyMultipleDriverDto?.drivers?.length) {
      companyMultipleDriverDto.drivers.map((driver, index) => {
        const regexKey = /drivers\[(\d+)\]\[(.+)\]/;
        const regexIndex = /drivers\[(\d+)\]/;

        const license: string[] = [];

        files.map((file) => {
          const matchIndex = file['fieldname']?.match(regexIndex);
          if (matchIndex && matchIndex[1] == String(index)) {
            const matchKey = file['fieldname'].match(regexKey);
            if (matchKey) {
              if (matchKey[2] === 'license') {
                license.push(getFileUrl(file['filename']));
              }
              // Assign last occurrence for non-array fields if any appear
              driver[matchKey[2]] = getFileUrl(file['filename']);
            }
          }
        });

        // Ensure license array is set (even if empty)
        (driver as any)['license'] = license;
      });
    }

    return await this.companiesService.createCompanyDrivers(company.id, companyMultipleDriverDto);
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

  @Get('rate')
  @ApiBearerAuth('Authorization')
  async getRate(
    @Req() req,
    @Res() res
  ) {
    const { user: company } = req;

    const rate = await this.companiesService.getRate(company.id);

    return res.json({ rate })
  }
}

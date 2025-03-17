import { Body, Controller, Post, Put, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CompanyDriverDto,
  CompanySignUpDto,
  CompleteCompanyDataDto,
  UpdateCompanyDataDto,
} from '../../common/DTOs/company.dto';
import { CompaniesService } from './companies.service';
import { FilesInterceptor } from '../../interceptors/files.interceptor';
import { getFileUrl } from '../../configs/multer.config';
import { removeFiles } from '../../common/helpers/filePaths';

@ApiTags( 'companies' )
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}

  @Post('signUp')
  @ApiConsumes('application/json')
  async signUp(@Req() req, @Res() res, @Body() signUpDto: CompanySignUpDto) {
    const data = await this.companiesService.create(signUpDto);

    return res.json({ message: 'Signed Up', data: { data } });
  }

  @Post('driverRegister')
  @ApiOperation({ summary: 'Register a new driver' })
  @ApiResponse({
    status: 201,
    description: 'The driver has been successfully registered',
  })
  async driverRegister(
    @Body() companyDriverDto: CompanyDriverDto,
    @Req() req,
  ): Promise<any> {
    const { user } = req;
    return await this.companiesService.createCompanyDriver(user, companyDriverDto);
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
}

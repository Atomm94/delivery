import { Body, Controller, Post, Put, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {
    CompleteCustomerDataDto,
    CustomersSignUpDto,
    UpdateCustomerDataDto,
} from '../common/DTOs/customer.dto';
import { CustomersService } from './customers.service';
import { FilesInterceptor } from '../interceptors/files.interceptor';
import { getFileUrl } from '../configs/multer.config';
import { removeFiles } from '../common/helpers/filePaths';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags( 'customers' )
@Controller('customers')
export class CustomersController {
    constructor(
      private readonly configService: ConfigService,
      private readonly customerService: CustomersService,
    ) {}

    @Post('signUp')
    @ApiConsumes('application/json')
    async signUp(@Req() req, @Res() res, @Body() signUpDto: CustomersSignUpDto) {
        const data = await this.customerService.create(signUpDto);

        return res.json({ message: 'Signed Up', data: { data } });
    }

    @Put('complete')
    @ApiBearerAuth('Authorization')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor)
    @ApiBody({ type: CompleteCustomerDataDto })
    async complete(
      @Req() req,
      @Res() res,
      @Body() completeDataDto: CompleteCustomerDataDto,
      @UploadedFiles() files: any,
    ) {
        try {
            if (files) {
                Object.entries(files).forEach(([key, value]) => {
                    completeDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
                })
            }

            const { user: customer } = req;

            const data = await this.customerService.complete(customer.id, completeDataDto);

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
    @UseInterceptors(FilesInterceptor)
    @ApiBearerAuth('Authorization')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateCustomerDataDto })
    async update(
      @Req() req,
      @Res() res,
      @Body() updateDataDto: UpdateCustomerDataDto,
      @UploadedFiles() files: any,
    ) {
        try {
            if (files) {
                Object.entries(files).forEach(([key, value]) => {
                    updateDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
                })
            }

            const { user: customer } = req;

            const data = await this.customerService.update(customer.id, updateDataDto);

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

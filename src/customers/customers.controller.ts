import { Body, Controller, Param, Post, Put, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {
    CompleteCustomerDataDto,
    CustomersSignUpDto,
    UpdateCustomerDataDto,
} from '../common/DTOs/customer.dto';
import { CustomersService } from './customers.service';
import { FilesInterceptor } from '../interceptors/files.interceptor';
import { CompleteDriverDataDto, UpdateDataDto } from '../common/DTOs/driver.dto';
import { getFileUrl } from '../configs/multer.config';
import { removeFiles } from '../common/helpers/filePaths';
import { ApiTags } from '@nestjs/swagger';

@ApiTags( 'customers' )
@Controller('customers')
export class CustomersController {
    constructor(
      private readonly configService: ConfigService,
      private readonly customerService: CustomersService,
    ) {}

    @Post('signUp')
    async signUp(@Req() req, @Res() res, @Body() signUpDto: CustomersSignUpDto) {
        const data = await this.customerService.create(signUpDto);

        return res.json({ message: 'Signed Up', data: { data } });
    }

    @Put('complete/:id')
    @UseInterceptors(FilesInterceptor)
    async complete(
      @Param('id') id: number,
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

            const data = await this.customerService.complete(id, completeDataDto);

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
      @Body() updateDataDto: UpdateCustomerDataDto,
      @UploadedFiles() files: any,
    ) {
        try {
            if (files) {
                Object.entries(files).forEach(([key, value]) => {
                    updateDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
                })
            }

            const data = await this.customerService.update(id, updateDataDto);

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

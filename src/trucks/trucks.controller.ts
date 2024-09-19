import { Body, Controller, Param, ParseIntPipe, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateMultipleTrucksDto, CreateTruckDataDto } from '../common/DTOs/truck.dto';
import { getFileUrl, removeFiles } from '../configs/multer.config';
import { TruckFilesInterceptor } from '../interceptors/truck.files.interceptor';
import { TrucksService } from './trucks.service';

@Controller('trucks')
export class TrucksController {
  constructor(
    private readonly trucksService: TrucksService,
  ) {}

  @Post('insert')
  @UseInterceptors(TruckFilesInterceptor)
  async insert(
    @Res() res,
    @Body() completeDataDto: CreateMultipleTrucksDto,
    @UploadedFiles() files: any,
  ) {
    try {
      completeDataDto.trucks.map((truck, index) => {
        const regexKey = /trucks\[(\d+)\]\[(.+)\]/;
        const regexIndex = /trucks\[(\d+)\]/;

        files.map(file => {
          const matchIndex = file['fieldname'].match(regexIndex);

          if (matchIndex[1] == index) {
            const matchKey = file['fieldname'].match(regexKey);
            truck[matchKey[2]] = getFileUrl(file['filename']);
          }
        })
      })


      const data = await this.trucksService.bulkInsert(completeDataDto);

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

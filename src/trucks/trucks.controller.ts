import { Body, Controller, Param, ParseIntPipe, Post, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateMultipleTrucksDto, TruckDataDto } from '../common/DTOs/truck.dto';
import { getFileUrl } from '../configs/multer.config';
import { TrucksService } from './trucks.service';
import { removeFiles } from '../common/helpers/filePaths';
import { FilesInterceptor } from '../interceptors/files.interceptor';

@Controller('trucks')
export class TrucksController {
  constructor(
    private readonly trucksService: TrucksService,
  ) {}

  @Post('insert/:driverId')
  @UseInterceptors(FilesInterceptor)
  async insert(
    @Param('driverId') driverId: number,
    @Res() res,
    @Body() completeDataDto: CreateMultipleTrucksDto,
    @UploadedFiles() files: any,
  ) {
    try {
      if (files) {
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
      }

      const data = await this.trucksService.bulkInsert(driverId, completeDataDto);

      return res.json({ message: 'Successfully added', data });
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
    @Body() updateDataDto: TruckDataDto,
    @UploadedFiles() files: any,
  ) {
    try {
      if (files) {
        Object.entries(files).forEach(([key, value]) => {
          updateDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
        })
      }

      const data = await this.trucksService.update(id, updateDataDto);

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

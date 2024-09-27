import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
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
          let vehicle_title = []
          let insurance_files = []
          let insurance_photos = []
          let photos = []

          files.map(file => {
            const matchIndex = file['fieldname'].match(regexIndex);

            if (matchIndex[1] == index) {
              const matchKey = file['fieldname'].match(regexKey);
              switch (matchKey[2]) {
                case 'vehicle_title':
                  vehicle_title.push(getFileUrl(file['filename']));
                  break;
                case 'insurance_files':
                  insurance_files.push(getFileUrl(file['filename']));
                  break;
                case 'insurance_photos':
                  insurance_photos.push(getFileUrl(file['filename']));
                  break;
                case 'photos':
                  photos.push(getFileUrl(file['filename']));
              }

              truck[matchKey[2]] = getFileUrl(file['filename']);
            }
          })

          truck['vehicle_title'] = vehicle_title;
          truck['insurance_files'] = insurance_files;
          truck['insurance_photos'] = insurance_photos;
          truck['photos'] = photos;
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
        let vehicle_title = []
        let insurance_files = []
        let insurance_photos = []
        let photos = []
        Object.entries(files).forEach(([key, value]) => {
          switch (value['fieldname']) {
            case 'vehicle_title':
              vehicle_title.push(getFileUrl(value['filename'] as string));
              break;
            case 'insurance_files':
              insurance_files.push(getFileUrl(value['filename'] as string));
              break;
            case 'insurance_photos':
              insurance_photos.push(getFileUrl(value['filename'] as string));
              break;
            case 'photos':
              photos.push(getFileUrl(value['filename'] as string));
          }
          updateDataDto[value['fieldname']] = getFileUrl(value['filename'] as string);
        })

        updateDataDto['vehicle_title'] = vehicle_title;
        updateDataDto['insurance_files'] = insurance_files;
        updateDataDto['insurance_photos'] = insurance_photos;
        updateDataDto['photos'] = photos;
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

  @Delete('/:id')
  async remove(
    @Param('id') id: number,
    @Res() res,
  ) {
    try {
      const data = await this.trucksService.remove(id);

      return res.json({ message: 'Successfully removed', data });
    } catch (error) {
      return res.status(404).json({
        statusCode: 404,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }

}


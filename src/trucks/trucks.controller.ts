import { Body, Controller, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CompleteDataDto } from '../common/DTOs/truck.dto';
import { getFileUrl } from '../configs/multer.config';
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
    @Param('id') id: number,
    @Res() res,
    @Body() completeDataDto: CompleteDataDto,
    @UploadedFiles() files: any,
  ) {
    try {
      Object.entries(files).forEach(([key, value]) => {
        completeDataDto[key] = getFileUrl(value[0]['filename']);
      })

      const data = await this.trucksService.bulkInsert(completeDataDto);

      return res.json({ message: 'Successfully updated', data });
    } catch (error) {
      return res.status(404).json({
        statusCode: 404,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }
}

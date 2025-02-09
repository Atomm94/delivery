import { unlinkSync } from 'fs';
import { join } from 'path';
import paths from '../../configs/paths.config';
import { BadRequestException } from '@nestjs/common';

export const removeFiles = (files: string[]) => {
  return files.forEach(file => {
    try {
      unlinkSync(join(paths.mainPath, file['path']));
    } catch (err) {
      throw new BadRequestException(`Failed to delete file: ${file['path']}`);
    }
  });
}
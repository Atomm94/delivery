import { unlinkSync } from 'fs';
import { join } from 'path';
import paths from '../../configs/paths.config';

export const removeFiles = (files: string[]) => {
  return files.forEach(file => {
    try {
      unlinkSync(join(paths.mainPath, file['path']));
    } catch (err) {
      throw new Error(`Failed to delete file: ${file['path']}`);
    }
  });
}
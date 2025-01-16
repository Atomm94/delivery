import { diskStorage } from 'multer';
import { parse } from 'path';

const FILE_HOSTING_URL = process.env.HOSTING || 'http://143.198.145.57:3000';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const filename = `${Math.floor(Math.random() * 9000000) + 1000000}${parse(file.originalname).name}.${parse(file.mimetype).name}`;
      callback(null, filename);
    },
  }),
};

export function getFileUrl(filename: string): string {
  return `${FILE_HOSTING_URL}/${filename}`;
}

import { diskStorage } from 'multer';
import { parse } from 'path';

const FILE_HOSTING_URL = process.env.HOSTING || 'http://ec2-13-60-241-214.eu-north-1.compute.amazonaws.com';

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

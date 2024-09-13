import { diskStorage } from 'multer';
import { extname } from 'path';

const FILE_HOSTING_URL = process.env.FILE_HOSTING_URL || 'http://localhost:3000';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const filename = `${Math.floor(Math.random() * 9000000) + 1000000}${extname(file.originalname)}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type'), false);
    }
  },
};

export function getFileUrl(filename: string): string {
  return `${FILE_HOSTING_URL}/${filename}`;
}

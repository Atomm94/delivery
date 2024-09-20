import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';

const FILE_HOSTING_URL = process.env.HOSTING || 'http://ec2-13-60-241-214.eu-north-1.compute.amazonaws.com';

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

export async function removeFiles(files: string[]) {
  files.forEach(file => {
    try {
      console.log(file);
      unlinkSync(file[0]['filepath']);
      console.log(`Successfully deleted file: ${file[0]['filepath']}`);
    } catch (err) {
      console.error(`Failed to delete file: ${file[0]['filepath']}`, err);
    }
  });
}
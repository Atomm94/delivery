import { diskStorage } from 'multer';
import { extname } from 'path';

const HOSTING_URL = 'http://localhost:3000/';

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
  return `${HOSTING_URL}/${filename}`;
}

// Function to extract the property name from the string
export function extractPropertyName(str: string): string | null {
  // Regular expression to match property names inside square brackets
  const regex: RegExp = /\[(\w+)\]/g;
  let match: RegExpExecArray | null;
  let propertyName: string | null = null;

  // Iterate through all matches
  while ((match = regex.exec(str)) !== null) {
    // Update the propertyName with the latest matched value
    propertyName = match[1];
  }

  return propertyName;
}


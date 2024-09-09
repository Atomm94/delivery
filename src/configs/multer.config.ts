// import { MulterOptions, MulterOptionsFactory } from '@nestjs/platform-express';
// import { Injectable } from '@nestjs/common';
// import * as multer from 'multer';
//
// @Injectable()
// export class MulterConfigService implements MulterOptionsFactory {
//   createMulterOptions(): MulterOptions {
//     return {
//       limits: {
//         fileSize: 5e6, // 5 MB
//       },
//       storage: multer.diskStorage({
//         destination: './uploads',
//         filename: (req, file, callback) => {
//           callback(null, `${Date.now()}-${file.originalname}`);
//         },
//       }),
//     };
//   }
// }

import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import {
  BookSchema,
  BookReadRecordSchema,
  BookCommentSchema,
  BookWishListSchema,
} from '../schemas/book.schema';
import {
  ReaderProfileSchema,
  ReaderReadHistorySchema,
  ReaderSchema,
} from '../schemas/reader.schema';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: process.env.UPLOAD_FOLDER,
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Book', schema: BookSchema },
      { name: 'BookReadRecord', schema: BookReadRecordSchema },
      { name: 'BookComment', schema: BookCommentSchema },
      { name: 'BookWishList', schema: BookWishListSchema },
      { name: 'Reader', schema: ReaderSchema },
      { name: 'ReaderProfile', schema: ReaderProfileSchema },
      { name: 'ReaderReadHistory', schema: ReaderReadHistorySchema },
    ]),
  ],
  controllers: [BookController],
  providers: [BookService],
  //exports: [BookService],
})
export class BookModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { WorkshopController } from './workshop.controller';
import { WorkshopService } from './workshop.service';
import { WorkshopSchema, SubscriberSchema } from '../schemas/workshop.schema';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: process.env.OTHER_UPLOAD_FOLDER,
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Workshop', schema: WorkshopSchema },
      { name: 'Subscriber', schema: SubscriberSchema },
    ]),
  ],
  controllers: [WorkshopController],
  providers: [WorkshopService],
})
export class WorkshopModule {}

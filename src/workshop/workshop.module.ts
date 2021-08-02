import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WorkshopController } from './workshop.controller';
import { WorkshopService } from './workshop.service';
import { WorkshopSchema, SubscriberSchema } from '../schemas/workshop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Workshop', schema: WorkshopSchema },
      { name: 'Subscriber', schema: SubscriberSchema },
    ]),
  ],
  controllers: [WorkshopController],
  providers: [WorkshopService],
})
export class WorkshopModule {}

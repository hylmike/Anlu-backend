import { Module } from '@nestjs/common';
import { FrontLogController } from './front-log.controller';

@Module({
  controllers: [FrontLogController],
})
export class FrontLogModule {}

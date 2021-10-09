import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { EmailerController } from './emailer.controller';
import { ReaderModule } from 'src/reader/reader.module';

@Module({
  imports: [ReaderModule],
  providers: [EmailerService],
  controllers: [EmailerController],
})
export class EmailerModule {}

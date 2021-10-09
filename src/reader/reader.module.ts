import { Module } from '@nestjs/common';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReaderSchema,
  ReaderProfileSchema,
  ReaderReadHistorySchema,
  TokenSchema,
} from '../schemas/reader.schema';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { BookSchema } from '../schemas/book.schema';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIMER },
    }),
    MongooseModule.forFeature([
      { name: 'Reader', schema: ReaderSchema },
      { name: 'ReaderProfile', schema: ReaderProfileSchema },
      { name: 'ReaderReadHistory', schema: ReaderReadHistorySchema },
      { name: 'Book', schema: BookSchema },
      { name: 'Token', schema: TokenSchema },
    ]),
  ],
  providers: [ReaderService, TokenService],
  controllers: [ReaderController],
  exports: [ReaderService, TokenService],
})
export class ReaderModule { }

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { LibrarianController } from './librarian.controller';
import { LibrarianService } from './librarian.service';
import {
  LibrarianSchema,
  OperationLogSchema,
} from '../schemas/librarian.schema';
import 'dotenv/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIMER },
    }),
    MongooseModule.forFeature([
      { name: 'Librarian', schema: LibrarianSchema },
      { name: 'OperationLog', schema: OperationLogSchema },
    ]),
  ],
  controllers: [LibrarianController],
  providers: [LibrarianService],
  exports: [LibrarianService],
})
export class LibrarianModule { }

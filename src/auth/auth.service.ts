import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import 'dotenv/config';

import { ReaderService } from '../reader/reader.service';
import { LibrarianService } from '../librarian/librarian.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly readerService: ReaderService,
    private readonly libService: LibrarianService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async validateReader(username: string, password: string): Promise<any> {
    const reader = await this.readerService.findOne(username);
    if (!reader) {
      console.log('Incorrect username in reader login, please check');
      return null;
    }
    const match = await bcrypt.compare(password, reader.password);
    if (match) {
      reader.password = null;
      this.logger.info(
        `Reader ${reader.username} username & password validation passed`,
      );
      return reader;
    }
    this.logger.warn(`Incorrect password in reader ${reader.username} login`);
    return null;
  }

  async validateLibrarian(username: string, password: string): Promise<any> {
    const librarian = await this.libService.findOne(username);
    if (!librarian) {
      console.log('Incorrect username in librarian login');
      return null;
    }
    const match = await bcrypt.compare(password, librarian.password);
    if (match) {
      librarian.password = null;
      this.logger.info(
        `Lib ${librarian.username} username & password validation passed`,
      );
      return librarian;
    }
    this.logger.warn(`Incorrect password in lib ${librarian.username} login`);
    return null;
  }
}

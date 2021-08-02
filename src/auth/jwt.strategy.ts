import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { ReaderService } from '../reader/reader.service';
import { LibrarianService } from '../librarian/librarian.service';
import { Reader } from '../reader/reader.interface';
import { Librarian } from '../librarian/librarian.interface';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'reader-jwt') {
  constructor(private readonly readerService: ReaderService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<Reader | undefined> {
    return this.readerService.getRefreshById(payload.readerID);
  }
}

@Injectable()
export class LibJwtStrategy extends PassportStrategy(Strategy, 'lib-jwt') {
  constructor(private readonly libService: LibrarianService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<Librarian | undefined> {
    return this.libService.getRefreshById(payload.libID);
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ReaderService } from '../reader/reader.service';
import { LibrarianService } from '../librarian/librarian.service';
import 'dotenv/config';

@Injectable()
export class UserJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'reader-jwt-refresh-token',
) {
  constructor(private readonly readerService: ReaderService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload) {
    const refreshToken = request.cookies?.Refresh;
    //console.log(request.cookies);
    if (refreshToken) {
      return this.readerService.refreshTokenValidate(
        refreshToken,
        payload.readerID,
      );
    }
    return null;
  }
}

@Injectable()
export class LibJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'lib-jwt-refresh-token',
) {
  constructor(private readonly libService: LibrarianService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload) {
    const refreshToken = request.cookies?.Refresh;
    //console.log(request.cookies);
    if (refreshToken) {
      return this.libService.refreshTokenValidate(refreshToken, payload.libID);
    }
    return null;
  }
}
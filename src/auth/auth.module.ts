import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReaderModule } from '../reader/reader.module';
import { PassportModule } from '@nestjs/passport';
import { UserLocalStrategy, LibLocalStrategy } from './local.strategy';
import { UserJwtStrategy, LibJwtStrategy } from './jwt.strategy';
import {
  UserJwtRefreshTokenStrategy,
  LibJwtRefreshTokenStrategy,
} from './jwtRefreshToken.strategy';
import { LibrarianModule } from '../librarian/librarian.module';

@Module({
  imports: [ReaderModule, LibrarianModule, PassportModule],
  providers: [
    AuthService,
    UserLocalStrategy,
    UserJwtStrategy,
    LibLocalStrategy,
    LibJwtStrategy,
    UserJwtRefreshTokenStrategy,
    LibJwtRefreshTokenStrategy,
  ],
})
export class AuthModule { }

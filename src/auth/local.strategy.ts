import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestWithLib } from 'src/librarian/librarian.interface';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(
  Strategy,
  'reader-local',
) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const reader = await this.authService.validateReader(username, password);
    if (!reader) {
      //throw 401 error with customized error message
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Incorrect username or password',
        },
        401,
      );
    }
    return reader;
  }
}

@Injectable()
export class LibLocalStrategy extends PassportStrategy(Strategy, 'lib-local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<RequestWithLib> {
    const librarian = await this.authService.validateLibrarian(username, password);
    if (!librarian) {
      //throw 401 error with customized error message
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Incorrect username or password',
        },
        401,
      );
    }
    return librarian;
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LibrarianService } from './librarian.service';
import {
  RegisterLibDto,
  UpdateLibProfileDto,
  ChangeLibPwdDto,
  OperationLogDto,
} from './lib.dto';

@Controller('api/lib')
export class LibrarianController {
  constructor(private readonly libService: LibrarianService) { }

  @Post('/register')
  register(@Body() registerUserDto: RegisterLibDto) {
    return this.libService.register(registerUserDto);
  }

  @Get('/:id')
  getProfile(@Param('id') libID: string) {
    return this.libService.getProfile(libID);
  }

  @Patch('/update')
  updateProfile(@Body() updateLibDto: UpdateLibProfileDto) {
    return this.libService.updateProfile(updateLibDto);
  }

  @UseGuards(AuthGuard('lib-local'))
  @Post('/adminlogin')
  adminLogin(@Request() req) {
    return this.libService.login(req, 'admin');
  }

  @UseGuards(AuthGuard('lib-local'))
  @Post('/liblogin')
  libLogin(@Request() req) {
    return this.libService.login(req, 'librarian');
  }

  @Patch('/changepwd')
  changePwd(@Body() changePwdDto: ChangeLibPwdDto) {
    return this.libService.changePwd(changePwdDto);
  }

  @UseGuards(AuthGuard('lib-jwt-refresh-token'))
  @Post('/refresh')
  refreshToken(@Request() req) {
    return this.libService.tokenRefresh(req);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Delete('/logout')
  logout(@Request() req) {
    return this.libService.logout(req);
  }

  @Post('/addoptlog')
  addOptLog(@Body() optLogDto: OperationLogDto) {
    return this.libService.addOperationLog(optLogDto);
  }

  @Get('/:id/optlog')
  getOptLog(@Param('id') libID: string) {
    return this.libService.getOperationLog(libID);
  }

  @Get('/checkadmin/:id')
  checkAdmin(@Param('id') libID: string) {
    return this.libService.checkAdmin(libID);
  }
}

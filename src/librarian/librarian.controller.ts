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
  Header,
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

  @UseGuards(AuthGuard('lib-jwt'))
  @Post('/register')
  register(@Body() registerUserDto: RegisterLibDto) {
    return this.libService.register(registerUserDto);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Get('/getalladmin')
  getAllAdmin() {
    return this.libService.getAllAdmin();
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Get('/getalllib')
  getAllLib() {
    return this.libService.getAllLibrarian();
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Get('/get/:id')
  getProfile(@Param('id') libID: string) {
    return this.libService.getProfile(libID);
  }

  @UseGuards(AuthGuard('lib-jwt'))
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

  @UseGuards(AuthGuard('lib-jwt'))
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

  @UseGuards(AuthGuard('lib-jwt'))
  @Delete('/delete/:id')
  @Header('content-type', 'application/json')
  deleteLib(@Param('id') libID: string) {
    return this.libService.deleteLib(libID);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Post('/addoptlog')
  addOptLog(@Body() optLogDto: OperationLogDto) {
    return this.libService.addOperationLog(optLogDto);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Get('/:id/optlog')
  getOptLog(@Param('id') libID: string) {
    return this.libService.getOperationLog(libID);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Get('/checkadmin/:id')
  checkAdmin(@Param('id') libID: string) {
    return this.libService.checkAdmin(libID);
  }
}

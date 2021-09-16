import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
  Patch,
  Param,
  Get,
  Header,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ReaderService } from './reader.service';
import {
  ChangeReaderPwdDto,
  RegisterReaderDto,
  UpdateReaderDto,
  FavourBookDto,
} from './reader.dto';

@Controller('api/reader')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) {}

  @Post('/register')
  register(@Body() regReaderDto: RegisterReaderDto) {
    return this.readerService.register(regReaderDto);
  }

  @Get('/get/:id')
  getProfile(@Param('id') readerID: string) {
    return this.readerService.getProfile(readerID);
  }

  @Get('/getall')
  getAllReader() {
    return this.readerService.getAllReader();
  }

  @Get('/gettopn/:num')
  getTopReader(@Param('num') num) {
    return this.readerService.getTopN(num);
  }

  @Patch('/update')
  updateReaderProfile(@Body() updateReaderDto: UpdateReaderDto) {
    return this.readerService.updateProfile(updateReaderDto);
  }

  @Patch('/changepwd')
  @Header('content-type', 'application/json')
  changePwd(@Body() changeReaderPwdDto: ChangeReaderPwdDto) {
    return this.readerService.changePwd(changeReaderPwdDto);
  }

  @Patch('/dea/:id')
  deaReader(@Param('id') readerID: string) {
    return this.readerService.deaReader(readerID);
  }

  @Patch('/act/:id')
  actReader(@Param('id') readerID: string) {
    return this.readerService.actReader(readerID);
  }

  @UseGuards(AuthGuard('reader-local'))
  @Post('/login')
  login(@Request() req) {
    return this.readerService.login(req);
  }

  @UseGuards(AuthGuard('reader-jwt-refresh-token'))
  @Post('/refresh')
  refreshToken(@Request() req) {
    return this.readerService.tokenRefresh(req);
  }

  @UseGuards(AuthGuard('reader-jwt'))
  @Delete('/logout')
  logout(@Request() req) {
    return this.readerService.logout(req);
  }

  @Delete('/del/:id')
  delReader(@Param('id') readerID: string) {
    return this.readerService.delReader(readerID);
  }

  @Post('/:id/addfavourbook')
  addFavourBook(
    @Param('id') readerID: string,
    @Body() favourBookDto: FavourBookDto,
  ) {
    return this.readerService.addFavourBook(readerID, favourBookDto);
  }

  @Get('/:id/getfavourlist')
  getFavourBookList(@Param('id') readerID: string) {
    return this.readerService.getFavourBookList(readerID);
  }

  @Patch('/:id/delfavourbook')
  delFavourBook(
    @Param('id') readerID: string,
    @Body() favourBookDto: FavourBookDto,
  ) {
    return this.readerService.delFavourBook(readerID, favourBookDto);
  }

  @Get('/:id/getreadbooks')
  getReadBooks(@Param('id') readerID: string) {
    return this.readerService.getReadBooks(readerID);
  }

  @Get('/:id/getreadhistory')
  getReadHistory(@Param('id') readerID: string) {
    return this.readerService.getReadHistory(readerID);
  }

  @Patch('/:id/delreadhistory')
  delReadHistory(@Param('id') readerID: string) {
    return this.readerService.delReadHistory(readerID);
  }
}

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
  ResetPwdDto,
  emailDto,
} from './reader.dto';
import { TokenService } from './token.service';

@Controller('api/reader')
export class ReaderController {
  constructor(
    private readonly readerService: ReaderService,
    private readonly tokenService: TokenService,
  ) { }

  @Post('/register')
  register(@Body() regReaderDto: RegisterReaderDto) {
    return this.readerService.register(regReaderDto);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/get/:id')
  getProfile(@Param('id') readerID: string) {
    return this.readerService.getProfile(readerID);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/getall')
  getAllReader() {
    return this.readerService.getAllReader();
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/gettopn/:num')
  getTopReader(@Param('num') num) {
    return this.readerService.getTopN(num);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Patch('/update')
  updateReaderProfile(@Body() updateReaderDto: UpdateReaderDto) {
    return this.readerService.updateProfile(updateReaderDto);
  }

  @UseGuards(AuthGuard('reader-jwt'))
  @Patch('/changepwd')
  @Header('content-type', 'application/json')
  changePwd(@Body() changeReaderPwdDto: ChangeReaderPwdDto) {
    return this.readerService.changePwd(changeReaderPwdDto);
  }

  @Patch('/resetpwd')
  resetPwd(@Body() resetPwdDto: ResetPwdDto) {
    return this.tokenService.resetPwd(resetPwdDto);
  }

  @Post('/verifyemail')
  verifyEmail(@Body() input: emailDto) {
    return this.tokenService.verifyEmail(input.email);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Patch('/dea/:id')
  deaReader(@Param('id') readerID: string) {
    return this.readerService.deaReader(readerID);
  }

  @UseGuards(AuthGuard('lib-jwt'))
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

  @UseGuards(AuthGuard('lib-jwt'))
  @Delete('/del/:id')
  delReader(@Param('id') readerID: string) {
    return this.readerService.delReader(readerID);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Post('/:id/addfavourbook')
  addFavourBook(
    @Param('id') readerID: string,
    @Body() favourBookDto: FavourBookDto,
  ) {
    return this.readerService.addFavourBook(readerID, favourBookDto);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/:id/getfavourlist')
  getFavourBookList(@Param('id') readerID: string) {
    return this.readerService.getFavourBookList(readerID);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Patch('/:id/delfavourbook')
  delFavourBook(
    @Param('id') readerID: string,
    @Body() favourBookDto: FavourBookDto,
  ) {
    return this.readerService.delFavourBook(readerID, favourBookDto);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/:id/getreadbooks')
  getReadBooks(@Param('id') readerID: string) {
    return this.readerService.getReadBooks(readerID);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/:id/getreadhistory')
  getReadHistory(@Param('id') readerID: string) {
    return this.readerService.getReadHistory(readerID);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Patch('/:id/delreadhistory')
  delReadHistory(@Param('id') readerID: string) {
    return this.readerService.delReadHistory(readerID);
  }
}

import {
  Body,
  Query,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { BookService } from './book.service';
import {
  BookDto,
  ReadRecordDto,
  BookCommentDto,
  CreateBookWishDto,
  UpdateWishStatusDto,
  SearchBookDto,
  GetWishListDto,
} from './book.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/book')
export class BookController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly bookService: BookService,
  ) { }

  @UseGuards(AuthGuard('lib-jwt'))
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `${file['path']}`;
    this.logger.info(
      `Start uploading ${file['filename']} into folder ${file['path']}`,
    );
    return { fileUrl: fileUrl };
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Post('/register')
  async registerBook(@Body() createBookDto: BookDto) {
    return this.bookService.register(createBookDto);
  }

  @Get('/info/:id')
  async findBook(@Param('id') bookID: string) {
    return this.bookService.findBook(bookID);
  }

  @Get('/findall/:format')
  async findAllBook(@Param('format') bookFormat: string) {
    return this.bookService.findAllBook(bookFormat);
  }

  @Post('/findlist')
  async findBookList(@Body() searchDto: SearchBookDto) {
    return this.bookService.findBookList(searchDto);
  }

  @Get('/searchbook')
  async searchBook(@Query('sval') searchValue: string) {
    return this.bookService.searchBook(searchValue);
  }

  @Get('/findhotbooks/:num')
  async findHotBooks(@Param('num') num: number) {
    return this.bookService.findHotBooks(num);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Get('/suminventory')
  async sumInventory() {
    return this.bookService.sumInventory();
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Delete('/del/:id')
  async delBook(@Param('id') bookID: string) {
    return this.bookService.delBook(bookID);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Patch('/update')
  async updateBookInfo(@Body() bookDto: BookDto) {
    return this.bookService.updateBookInfo(bookDto);
  }

  @UseGuards(AuthGuard('reader-jwt'))
  @Post('/addreadrecord')
  async addReadRecord(@Body() readRecordDto: ReadRecordDto) {
    return this.bookService.addReadRecord(readRecordDto);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/:id/getreadhistory')
  async getReadHistory(@Param('id') bookID: string) {
    return this.bookService.getReadHistory(bookID);
  }

  @Post('/addcomment')
  async addComment(@Body() bookCommentDto: BookCommentDto) {
    return this.bookService.addBookComment(bookCommentDto);
  }

  @Get('/:id/getcomments')
  async getComments(@Param('id') bookID: string) {
    return this.bookService.getBookComments(bookID);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Post('/addbookwish')
  async addBookWish(@Body() createWishDto: CreateBookWishDto) {
    return this.bookService.addBookWish(createWishDto);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/getbookwish/:id')
  async getBookWish(@Param('id') wishID: string) {
    return this.bookService.getBookWish(wishID);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Get('/getunfulfilwishlist')
  async getUnfulfilWishList() {
    return this.bookService.getUnfulfilWishList();
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Post('/getwishlist/')
  async getWishList(@Body() getWishListDto: GetWishListDto) {
    return this.bookService.getWishList(getWishListDto);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Patch('/updatewishstatus')
  async updateWishStatus(@Body() updateWishStatusDto: UpdateWishStatusDto) {
    return this.bookService.updateWishStatus(updateWishStatusDto);
  }

  @UseGuards(AuthGuard(['reader-jwt', 'lib-jwt']))
  @Delete('/delwish/:id')
  async delWish(@Param('id') wishID: string) {
    return this.bookService.delWish(wishID);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Patch('/:id/clearreadhistory')
  async clearReadRecord(@Param('id') bookID: string) {
    return this.bookService.clearReadHistory(bookID);
  }
}

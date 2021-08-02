import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Inject,
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
} from './book.dto';

@Controller('api/book')
export class BookController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly bookService: BookService,
  ) { }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `${file['path']}/${file['filename']}`;
    this.logger.info(
      `Start uploading ${file['filename']} into folder ${file['path']}`,
    );
    return { fileUrl: fileUrl };
  }

  @Post('/register')
  async registerBook(@Body() createBookDto: BookDto) {
    return this.bookService.register(createBookDto);
  }

  @Get('/:id')
  async findBook(@Param('id') bookID: string) {
    return this.bookService.findBook(bookID);
  }

  @Delete('/del/:id')
  async delBook(@Param('id') bookID: string) {
    return this.bookService.delBook(bookID);
  }

  @Patch('/update')
  async updateBookInfo(@Body() bookDto: BookDto) {
    return this.bookService.updateBookInfo(bookDto);
  }

  @Post('/addreadrecord')
  async addReadRecord(@Body() readRecordDto: ReadRecordDto) {
    return this.bookService.addReadRecord(readRecordDto);
  }

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

  @Post('/addbookwish')
  async addBookWish(@Body() createWishDto: CreateBookWishDto) {
    return this.bookService.addBookWish(createWishDto);
  }

  @Get('/getbookwish/:id')
  async getBookWish(@Param('id') wishID: string) {
    return this.bookService.getBookWish(wishID);
  }

  @Get('/getbookwishlist')
  async getWishList() {
    return this.bookService.getBookWishList();
  }

  @Patch('/updatewishstatus')
  async updateWishStatus(@Body() updateWishStatusDto: UpdateWishStatusDto) {
    return this.bookService.updateWishStatus(updateWishStatusDto);
  }

  @Patch('/:id/clearreadhistory')
  async clearReadRecord(@Param('id') bookID: string) {
    return this.bookService.clearReadHistory(bookID);
  }
}

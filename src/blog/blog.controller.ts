import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogDto } from './blog.dto';

import { BlogService } from './blog.service';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @UseGuards(AuthGuard('lib-jwt'))
  @Post('/create')
  async create(@Body() blogDto: BlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get('/get/:id')
  async get(@Param('id') blogID: string) {
    return this.blogService.getBlog(blogID);
  }

  @Get('/getlatest/:num')
  async getBlogList(@Param('num') num: number) {
    return this.blogService.getBlogList(num);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Patch('/update/:id')
  async update(@Param('id') blogID: string, @Body() blogDto: BlogDto) {
    return this.blogService.updateBlog(blogID, blogDto);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Delete('/del/:id')
  async delBlog(@Param('id') blogID: string) {
    return this.blogService.delBlog(blogID);
  }
}

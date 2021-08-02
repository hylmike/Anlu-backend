import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogDto } from './blog.dto';

import { BlogService } from './blog.service';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post('/create')
  async create(@Body() blogDto: BlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get('/:id')
  async get(@Param('id') blogID: string) {
    return this.blogService.getBlog(blogID);
  }

  @Get('/getlatest/:id')
  async getList(@Param('id') num: number) {
    return this.blogService.getBlogList(num);
  }

  @Patch('/:id/update')
  async update(@Param('id') blogID: string, @Body() blogDto: BlogDto) {
    return this.blogService.updateBlog(blogID, blogDto);
  }

  @Delete('/:id/del')
  async delBlog(@Param('id') blogID: string) {
    return this.blogService.delBlog(blogID);
  }
}

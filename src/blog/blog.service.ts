import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog, BlogDocument } from './blog.interface';
import { BlogDto } from './blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Blog') private readonly blogModel: Model<BlogDocument>,
  ) { }

  async createBlog(blogDto: BlogDto): Promise<Blog> {
    if (blogDto.topic === '') {
      this.logger.warn('Received empty blog, create blog failed');
      return null;
    }
    const now = new Date();
    const blog = new this.blogModel({
      topic: blogDto.topic,
      category: blogDto.category,
      creator: blogDto.creator,
      content: blogDto.content,
      createTime: now,
      keywords: blogDto.keywords,
    });
    try {
      const newBlog = await blog.save();
      this.logger.info(`Success create blog for '${newBlog.topic}'`);
      return newBlog;
    } catch (err) {
      this.logger.error(`Save blog ${blog.topic} failed: ${err}`);
      return null;
    }
  }

  async getBlog(blogID: string): Promise<Blog> {
    const blog = await this.blogModel.findById(blogID);
    if (!blog) {
      this.logger.warn(`Blog ${blogID} does not exist, getting blog failed`);
      return null;
    }
    this.logger.info(`Success get blog ${blogID} from database`);
    return blog;
  }

  async getBlogList(num): Promise<Blog[]> {
    const blogNum = Number(num);
    let blogList = [];
    if (blogNum == 0) {
      blogList = await this.blogModel.find({}).sort({ createTime: -1 }).exec();
    } else if (blogNum > 0) {
      blogList = await this.blogModel
        .find({})
        .sort({ createTime: -1 })
        .limit(blogNum)
        .exec();
    }
    if (blogList) {
      this.logger.info(`Success get latest ${num} blog from database`);
      return blogList;
    } else {
      this.logger.warn('Failed to get latest blog list from server');
      return null;
    }
  }

  async updateBlog(blogID: string, blogDto: BlogDto): Promise<Blog> {
    const blog = await this.blogModel.findById(blogID);
    if (!blog) {
      this.logger.warn(`Blog ${blogID} does not exist, update blog failed`);
      return null;
    }
    for (const item in blogDto) {
      if (item !== 'creator' && blogDto[item].trim() !== blog[item])
        blog[item] = blogDto[item];
    }
    try {
      const updatedBlog = await blog.save();
      this.logger.info(`Success updated blog ${updatedBlog.topic}`);
      return updatedBlog;
    } catch (err) {
      this.logger.error(`Save blog ${blog.id} failed during updating: ${err}`);
    }
  }

  async delBlog(blogID: string) {
    const blog = await this.blogModel.findByIdAndDelete(blogID);
    if (blog) {
      this.logger.info(`Success deleted blog ${blogID}`);
      return JSON.stringify(blogID);
    }
  }
}

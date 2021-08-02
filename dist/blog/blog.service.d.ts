import { Logger } from 'winston';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.interface';
import { BlogDto } from './blog.dto';
export declare class BlogService {
    private readonly logger;
    private readonly blogModel;
    constructor(logger: Logger, blogModel: Model<BlogDocument>);
    createBlog(blogDto: BlogDto): Promise<Blog>;
    getBlog(blogID: string): Promise<Blog>;
    getBlogList(num: any): Promise<Blog[]>;
    updateBlog(blogID: string, blogDto: BlogDto): Promise<string>;
    delBlog(blogID: string): Promise<string>;
}

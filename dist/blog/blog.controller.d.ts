import { BlogDto } from './blog.dto';
import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    create(blogDto: BlogDto): Promise<import("./blog.interface").Blog>;
    get(blogID: string): Promise<import("./blog.interface").Blog>;
    getBlogList(num: number): Promise<import("./blog.interface").Blog[]>;
    update(blogID: string, blogDto: BlogDto): Promise<import("./blog.interface").Blog>;
    delBlog(blogID: string): Promise<string>;
}

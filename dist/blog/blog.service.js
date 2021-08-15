"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BlogService = class BlogService {
    constructor(logger, blogModel) {
        this.logger = logger;
        this.blogModel = blogModel;
    }
    async createBlog(blogDto) {
        if (blogDto.topic === '') {
            this.logger.warn('Received empty blog, create blog failed');
            return null;
        }
        const now = new Date();
        const blog = new this.blogModel({
            topic: blogDto.topic,
            category: blogDto.category,
            author: blogDto.author,
            content: blogDto.content,
            createTime: now,
            keyword: blogDto.keyword,
        });
        try {
            const newBlog = await blog.save();
            this.logger.info(`Success create blog for '${newBlog.topic}'`);
            return newBlog;
        }
        catch (err) {
            this.logger.error(`Save blog ${blog.topic} failed: ${err}`);
            return null;
        }
    }
    async getBlog(blogID) {
        const blog = await this.blogModel.findById(blogID);
        if (!blog) {
            this.logger.warn(`Blog ${blogID} does not exist, getting blog failed`);
            return null;
        }
        this.logger.info(`Success get blog ${blogID} from database`);
        return blog;
    }
    async getBlogList(num) {
        const blogList = await this.blogModel
            .find({})
            .sort({ createTime: -1 })
            .limit(Number(num))
            .exec();
        this.logger.info(`Success get latest ${num} blog from database`);
        return blogList;
    }
    async updateBlog(blogID, blogDto) {
        const blog = await this.blogModel.findById(blogID);
        if (!blog) {
            this.logger.warn(`Blog ${blogID} does not exist, update blog failed`);
            return null;
        }
        for (const item in blogDto) {
            if (blogDto[item].trim() !== '')
                blog[item] = blogDto[item];
        }
        try {
            const updatedBlog = await blog.save();
            this.logger.info(`Success updated blog ${updatedBlog.topic}`);
            return updatedBlog._id;
        }
        catch (err) {
            this.logger.error(`Save blog ${blog.id} failed during updating: ${err}`);
        }
    }
    async delBlog(blogID) {
        await this.blogModel.findByIdAndDelete(blogID);
        this.logger.info(`Success deleted blog ${blogID}`);
        return blogID;
    }
};
BlogService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, mongoose_1.InjectModel('Blog')),
    __metadata("design:paramtypes", [Object, mongoose_2.Model])
], BlogService);
exports.BlogService = BlogService;
//# sourceMappingURL=blog.service.js.map
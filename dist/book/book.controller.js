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
exports.BookController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const nest_winston_1 = require("nest-winston");
const book_service_1 = require("./book.service");
let BookController = class BookController {
    constructor(logger, bookService) {
        this.logger = logger;
        this.bookService = bookService;
    }
    async fileUpload(file) {
        const fileUrl = `${file['path']}`;
        this.logger.info(`Start uploading ${file['filename']} into folder ${file['path']}`);
        return { fileUrl: fileUrl };
    }
    async registerBook(createBookDto) {
        return this.bookService.register(createBookDto);
    }
    async findBook(bookID) {
        return this.bookService.findBook(bookID);
    }
    async findAllBook(bookFormat) {
        return this.bookService.findAllBook(bookFormat);
    }
    async findBookList(searchDto) {
        return this.bookService.findBookList(searchDto);
    }
    async searchBook(searchValue) {
        return this.bookService.searchBook(searchValue);
    }
    async delBook(bookID) {
        return this.bookService.delBook(bookID);
    }
    async updateBookInfo(bookDto) {
        return this.bookService.updateBookInfo(bookDto);
    }
    async addReadRecord(readRecordDto) {
        return this.bookService.addReadRecord(readRecordDto);
    }
    async getReadHistory(bookID) {
        return this.bookService.getReadHistory(bookID);
    }
    async addComment(bookCommentDto) {
        return this.bookService.addBookComment(bookCommentDto);
    }
    async getComments(bookID) {
        return this.bookService.getBookComments(bookID);
    }
    async addBookWish(createWishDto) {
        return this.bookService.addBookWish(createWishDto);
    }
    async getBookWish(wishID) {
        return this.bookService.getBookWish(wishID);
    }
    async getWishList() {
        return this.bookService.getBookWishList();
    }
    async updateWishStatus(updateWishStatusDto) {
        return this.bookService.updateWishStatus(updateWishStatusDto);
    }
    async clearReadRecord(bookID) {
        return this.bookService.clearReadHistory(bookID);
    }
};
__decorate([
    common_1.Post('/upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "fileUpload", null);
__decorate([
    common_1.Post('/register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "registerBook", null);
__decorate([
    common_1.Get('/info/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "findBook", null);
__decorate([
    common_1.Get('/findall/:format'),
    __param(0, common_1.Param('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "findAllBook", null);
__decorate([
    common_1.Post('/findlist'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "findBookList", null);
__decorate([
    common_1.Get('/searchbook'),
    __param(0, common_1.Query('sval')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "searchBook", null);
__decorate([
    common_1.Delete('/del/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "delBook", null);
__decorate([
    common_1.Patch('/update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "updateBookInfo", null);
__decorate([
    common_1.Post('/addreadrecord'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "addReadRecord", null);
__decorate([
    common_1.Get('/:id/getreadhistory'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "getReadHistory", null);
__decorate([
    common_1.Post('/addcomment'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "addComment", null);
__decorate([
    common_1.Get('/:id/getcomments'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "getComments", null);
__decorate([
    common_1.Post('/addbookwish'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "addBookWish", null);
__decorate([
    common_1.Get('/getbookwish/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "getBookWish", null);
__decorate([
    common_1.Get('/getbookwishlist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookController.prototype, "getWishList", null);
__decorate([
    common_1.Patch('/updatewishstatus'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "updateWishStatus", null);
__decorate([
    common_1.Patch('/:id/clearreadhistory'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "clearReadRecord", null);
BookController = __decorate([
    common_1.Controller('api/book'),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [Object, book_service_1.BookService])
], BookController);
exports.BookController = BookController;
//# sourceMappingURL=book.controller.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModule = void 0;
const common_1 = require("@nestjs/common");
const book_controller_1 = require("./book.controller");
const book_service_1 = require("./book.service");
const mongoose_1 = require("@nestjs/mongoose");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
require("dotenv/config");
const book_schema_1 = require("../schemas/book.schema");
const reader_schema_1 = require("../schemas/reader.schema");
let BookModule = class BookModule {
};
BookModule = __decorate([
    common_1.Module({
        imports: [
            platform_express_1.MulterModule.register({
                storage: multer_1.diskStorage({
                    destination: process.env.BOOK_UPLOAD_FOLDER,
                    filename: (req, file, cb) => {
                        return cb(null, file.originalname);
                    },
                }),
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Book', schema: book_schema_1.BookSchema },
                { name: 'BookReadRecord', schema: book_schema_1.BookReadRecordSchema },
                { name: 'BookComment', schema: book_schema_1.BookCommentSchema },
                { name: 'BookWish', schema: book_schema_1.BookWishSchema },
                { name: 'Reader', schema: reader_schema_1.ReaderSchema },
                { name: 'ReaderProfile', schema: reader_schema_1.ReaderProfileSchema },
                { name: 'ReaderReadHistory', schema: reader_schema_1.ReaderReadHistorySchema },
            ]),
        ],
        controllers: [book_controller_1.BookController],
        providers: [book_service_1.BookService],
    })
], BookModule);
exports.BookModule = BookModule;
//# sourceMappingURL=book.module.js.map
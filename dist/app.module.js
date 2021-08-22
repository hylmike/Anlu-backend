"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const core_1 = require("@nestjs/core");
const winston = require("winston");
const nest_winston_1 = require("nest-winston");
const serve_static_1 = require("@nestjs/serve-static");
require("dotenv/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const reader_module_1 = require("./reader/reader.module");
const auth_module_1 = require("./auth/auth.module");
const http_excetption_filter_1 = require("./common/http-excetption.filter");
const librarian_module_1 = require("./librarian/librarian.module");
const book_module_1 = require("./book/book.module");
const workshop_module_1 = require("./workshop/workshop.module");
const database_module_1 = require("./database/database.module");
const blog_module_1 = require("./blog/blog.module");
const path_1 = require("path");
const front_log_module_1 = require("./front-log/front-log.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: process.env.NODE_ENV === 'production'
                        ? process.env.MONGO_PROD_URI
                        : process.env.NODE_ENV === 'development'
                            ? process.env.MONGO_DEV_URI
                            : process.env.MONGO_TEST_URI,
                    useNewUrlParser: true,
                    useFindAndModify: false,
                    useCreateIndex: true,
                }),
            }),
            nest_winston_1.WinstonModule.forRoot({
                level: 'info',
                format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), winston.format.json()),
                transports: [
                    new winston.transports.File({ filename: 'combined.log', level: 'info' }),
                    new winston.transports.File({ filename: 'error.log', level: 'error' }),
                ],
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.join(__dirname, '../..', 'bookfiles'),
                exclude: ['/api*'],
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.join(__dirname, '../..', 'otherfiles'),
                serveRoot: '/otherfiles',
                exclude: ['/api*'],
            }),
            reader_module_1.ReaderModule,
            auth_module_1.AuthModule,
            librarian_module_1.LibrarianModule,
            book_module_1.BookModule,
            workshop_module_1.WorkshopModule,
            database_module_1.DatabaseModule,
            blog_module_1.BlogModule,
            front_log_module_1.FrontLogModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_excetption_filter_1.HttpExceptionFilter,
            },
            app_service_1.AppService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
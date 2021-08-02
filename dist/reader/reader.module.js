"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderModule = void 0;
const common_1 = require("@nestjs/common");
const reader_service_1 = require("./reader.service");
const reader_controller_1 = require("./reader.controller");
const mongoose_1 = require("@nestjs/mongoose");
const reader_schema_1 = require("../schemas/reader.schema");
const jwt_1 = require("@nestjs/jwt");
require("dotenv/config");
let ReaderModule = class ReaderModule {
};
ReaderModule = __decorate([
    common_1.Module({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.ACCESS_TOKEN_SECRET,
                signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIMER },
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Reader', schema: reader_schema_1.ReaderSchema },
                { name: 'ReaderProfile', schema: reader_schema_1.ReaderProfileSchema },
                { name: 'ReaderReadHistory', schema: reader_schema_1.ReaderReadHistorySchema },
            ]),
        ],
        providers: [reader_service_1.ReaderService],
        controllers: [reader_controller_1.ReaderController],
        exports: [reader_service_1.ReaderService],
    })
], ReaderModule);
exports.ReaderModule = ReaderModule;
//# sourceMappingURL=reader.module.js.map
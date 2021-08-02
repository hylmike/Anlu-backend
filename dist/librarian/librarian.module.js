"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrarianModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const librarian_controller_1 = require("./librarian.controller");
const librarian_service_1 = require("./librarian.service");
const librarian_schema_1 = require("../schemas/librarian.schema");
require("dotenv/config");
let LibrarianModule = class LibrarianModule {
};
LibrarianModule = __decorate([
    common_1.Module({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.ACCESS_TOKEN_SECRET,
                signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIMER },
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Librarian', schema: librarian_schema_1.LibrarianSchema },
                { name: 'OperationLog', schema: librarian_schema_1.OperationLogSchema },
            ]),
        ],
        controllers: [librarian_controller_1.LibrarianController],
        providers: [librarian_service_1.LibrarianService],
        exports: [librarian_service_1.LibrarianService],
    })
], LibrarianModule);
exports.LibrarianModule = LibrarianModule;
//# sourceMappingURL=librarian.module.js.map
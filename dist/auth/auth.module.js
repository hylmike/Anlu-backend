"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const reader_module_1 = require("../reader/reader.module");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./local.strategy");
const jwt_strategy_1 = require("./jwt.strategy");
const jwtRefreshToken_strategy_1 = require("./jwtRefreshToken.strategy");
const librarian_module_1 = require("../librarian/librarian.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [reader_module_1.ReaderModule, librarian_module_1.LibrarianModule, passport_1.PassportModule],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.UserLocalStrategy,
            jwt_strategy_1.UserJwtStrategy,
            local_strategy_1.LibLocalStrategy,
            jwt_strategy_1.LibJwtStrategy,
            jwtRefreshToken_strategy_1.UserJwtRefreshTokenStrategy,
            jwtRefreshToken_strategy_1.LibJwtRefreshTokenStrategy,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map
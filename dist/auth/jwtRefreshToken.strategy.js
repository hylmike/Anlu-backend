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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibJwtRefreshTokenStrategy = exports.UserJwtRefreshTokenStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const reader_service_1 = require("../reader/reader.service");
const librarian_service_1 = require("../librarian/librarian.service");
require("dotenv/config");
let UserJwtRefreshTokenStrategy = class UserJwtRefreshTokenStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy, 'reader-jwt-refresh-token') {
    constructor(readerService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    var _a;
                    return (_a = request === null || request === void 0 ? void 0 : request.cookies) === null || _a === void 0 ? void 0 : _a.Refresh;
                },
            ]),
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        });
        this.readerService = readerService;
    }
    async validate(request, payload) {
        var _a;
        const refreshToken = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.Refresh;
        if (refreshToken) {
            return this.readerService.refreshTokenValidate(refreshToken, payload.readerID);
        }
        return null;
    }
};
UserJwtRefreshTokenStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [reader_service_1.ReaderService])
], UserJwtRefreshTokenStrategy);
exports.UserJwtRefreshTokenStrategy = UserJwtRefreshTokenStrategy;
let LibJwtRefreshTokenStrategy = class LibJwtRefreshTokenStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy, 'lib-jwt-refresh-token') {
    constructor(libService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    var _a;
                    return (_a = request === null || request === void 0 ? void 0 : request.cookies) === null || _a === void 0 ? void 0 : _a.Refresh;
                },
            ]),
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        });
        this.libService = libService;
    }
    async validate(request, payload) {
        var _a;
        const refreshToken = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.Refresh;
        if (refreshToken) {
            return this.libService.refreshTokenValidate(refreshToken, payload.libID);
        }
        return null;
    }
};
LibJwtRefreshTokenStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [librarian_service_1.LibrarianService])
], LibJwtRefreshTokenStrategy);
exports.LibJwtRefreshTokenStrategy = LibJwtRefreshTokenStrategy;
//# sourceMappingURL=jwtRefreshToken.strategy.js.map
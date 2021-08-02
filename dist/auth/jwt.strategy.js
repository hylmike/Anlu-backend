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
exports.LibJwtStrategy = exports.UserJwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
require("dotenv/config");
const reader_service_1 = require("../reader/reader.service");
const librarian_service_1 = require("../librarian/librarian.service");
let UserJwtStrategy = class UserJwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy, 'reader-jwt') {
    constructor(readerService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        });
        this.readerService = readerService;
    }
    async validate(payload) {
        return this.readerService.getRefreshById(payload.readerID);
    }
};
UserJwtStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [reader_service_1.ReaderService])
], UserJwtStrategy);
exports.UserJwtStrategy = UserJwtStrategy;
let LibJwtStrategy = class LibJwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy, 'lib-jwt') {
    constructor(libService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        });
        this.libService = libService;
    }
    async validate(payload) {
        return this.libService.getRefreshById(payload.libID);
    }
};
LibJwtStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [librarian_service_1.LibrarianService])
], LibJwtStrategy);
exports.LibJwtStrategy = LibJwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map
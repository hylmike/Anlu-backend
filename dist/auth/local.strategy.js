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
exports.LibLocalStrategy = exports.UserLocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const librarian_interface_1 = require("../librarian/librarian.interface");
let UserLocalStrategy = class UserLocalStrategy extends passport_1.PassportStrategy(passport_local_1.Strategy, 'reader-local') {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async validate(username, password) {
        const reader = await this.authService.validateReader(username, password);
        if (!reader) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNAUTHORIZED,
                message: 'Incorrect username or password',
            }, 401);
        }
        return reader;
    }
};
UserLocalStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], UserLocalStrategy);
exports.UserLocalStrategy = UserLocalStrategy;
let LibLocalStrategy = class LibLocalStrategy extends passport_1.PassportStrategy(passport_local_1.Strategy, 'lib-local') {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async validate(username, password) {
        const librarian = await this.authService.validateLibrarian(username, password);
        if (!librarian) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNAUTHORIZED,
                message: 'Incorrect username or password',
            }, 401);
        }
        return librarian;
    }
};
LibLocalStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], LibLocalStrategy);
exports.LibLocalStrategy = LibLocalStrategy;
//# sourceMappingURL=local.strategy.js.map
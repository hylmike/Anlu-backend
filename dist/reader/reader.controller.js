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
exports.ReaderController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const reader_service_1 = require("./reader.service");
let ReaderController = class ReaderController {
    constructor(readerService) {
        this.readerService = readerService;
    }
    register(regReaderDto) {
        return this.readerService.register(regReaderDto);
    }
    getProfile(readerID) {
        return this.readerService.getProfile(readerID);
    }
    getAllReader() {
        return this.readerService.getAllReader();
    }
    getTopReader(num) {
        return this.readerService.getTopN(num);
    }
    updateReaderProfile(updateReaderDto) {
        return this.readerService.updateProfile(updateReaderDto);
    }
    changePwd(changeReaderPwdDto) {
        return this.readerService.changePwd(changeReaderPwdDto);
    }
    deaReader(readerID) {
        return this.readerService.deaReader(readerID);
    }
    actReader(readerID) {
        return this.readerService.actReader(readerID);
    }
    login(req) {
        return this.readerService.login(req);
    }
    refreshToken(req) {
        return this.readerService.tokenRefresh(req);
    }
    logout(req) {
        return this.readerService.logout(req);
    }
    delReader(readerID) {
        return this.readerService.delReader(readerID);
    }
    addFavourBook(readerID, favourBookDto) {
        return this.readerService.addFavourBook(readerID, favourBookDto);
    }
    getFavourBookList(readerID) {
        return this.readerService.getFavourBookList(readerID);
    }
    delFavourBook(readerID, favourBookDto) {
        return this.readerService.delFavourBook(readerID, favourBookDto);
    }
    getReadBooks(readerID) {
        return this.readerService.getReadBooks(readerID);
    }
    getReadHistory(readerID) {
        return this.readerService.getReadHistory(readerID);
    }
    delReadHistory(readerID) {
        return this.readerService.delReadHistory(readerID);
    }
};
__decorate([
    common_1.Post('/register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "register", null);
__decorate([
    common_1.Get('/get/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "getProfile", null);
__decorate([
    common_1.Get('/getall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "getAllReader", null);
__decorate([
    common_1.Get('/gettopn/:num'),
    __param(0, common_1.Param('num')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "getTopReader", null);
__decorate([
    common_1.Patch('/update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "updateReaderProfile", null);
__decorate([
    common_1.Patch('/changepwd'),
    common_1.Header('content-type', 'application/json'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "changePwd", null);
__decorate([
    common_1.Patch('/dea/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "deaReader", null);
__decorate([
    common_1.Patch('/act/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "actReader", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('reader-local')),
    common_1.Post('/login'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "login", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('reader-jwt-refresh-token')),
    common_1.Post('/refresh'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "refreshToken", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('reader-jwt')),
    common_1.Delete('/logout'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "logout", null);
__decorate([
    common_1.Delete('/del/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "delReader", null);
__decorate([
    common_1.Post('/:id/addfavourbook'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "addFavourBook", null);
__decorate([
    common_1.Get('/:id/getfavourlist'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "getFavourBookList", null);
__decorate([
    common_1.Patch('/:id/delfavourbook'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "delFavourBook", null);
__decorate([
    common_1.Get('/:id/getreadbooks'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "getReadBooks", null);
__decorate([
    common_1.Get('/:id/getreadhistory'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "getReadHistory", null);
__decorate([
    common_1.Patch('/:id/delreadhistory'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReaderController.prototype, "delReadHistory", null);
ReaderController = __decorate([
    common_1.Controller('api/reader'),
    __metadata("design:paramtypes", [reader_service_1.ReaderService])
], ReaderController);
exports.ReaderController = ReaderController;
//# sourceMappingURL=reader.controller.js.map
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
exports.LibrarianController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const librarian_service_1 = require("./librarian.service");
const lib_dto_1 = require("./lib.dto");
let LibrarianController = class LibrarianController {
    constructor(libService) {
        this.libService = libService;
    }
    register(registerUserDto) {
        return this.libService.register(registerUserDto);
    }
    getAllAdmin() {
        return this.libService.getAllAdmin();
    }
    getAllLib() {
        return this.libService.getAllLibrarian();
    }
    getProfile(libID) {
        return this.libService.getProfile(libID);
    }
    updateProfile(updateLibDto) {
        return this.libService.updateProfile(updateLibDto);
    }
    adminLogin(req) {
        return this.libService.login(req, 'admin');
    }
    libLogin(req) {
        return this.libService.login(req, 'librarian');
    }
    changePwd(changePwdDto) {
        return this.libService.changePwd(changePwdDto);
    }
    refreshToken(req) {
        return this.libService.tokenRefresh(req);
    }
    logout(req) {
        return this.libService.logout(req);
    }
    deleteLib(libID) {
        return this.libService.deleteLib(libID);
    }
    addOptLog(optLogDto) {
        return this.libService.addOperationLog(optLogDto);
    }
    getOptLog(libID) {
        return this.libService.getOperationLog(libID);
    }
    checkAdmin(libID) {
        return this.libService.checkAdmin(libID);
    }
};
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Post('/register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lib_dto_1.RegisterLibDto]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "register", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Get('/getalladmin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "getAllAdmin", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Get('/getalllib'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "getAllLib", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Get('/get/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "getProfile", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Patch('/update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lib_dto_1.UpdateLibProfileDto]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "updateProfile", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-local')),
    common_1.Post('/adminlogin'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "adminLogin", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-local')),
    common_1.Post('/liblogin'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "libLogin", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Patch('/changepwd'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "changePwd", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt-refresh-token')),
    common_1.Post('/refresh'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "refreshToken", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Delete('/logout'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "logout", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Delete('/delete/:id'),
    common_1.Header('content-type', 'application/json'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "deleteLib", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Post('/addoptlog'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "addOptLog", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Get('/:id/optlog'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "getOptLog", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Get('/checkadmin/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LibrarianController.prototype, "checkAdmin", null);
LibrarianController = __decorate([
    common_1.Controller('api/lib'),
    __metadata("design:paramtypes", [librarian_service_1.LibrarianService])
], LibrarianController);
exports.LibrarianController = LibrarianController;
//# sourceMappingURL=librarian.controller.js.map
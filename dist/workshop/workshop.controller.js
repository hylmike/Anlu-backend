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
exports.WorkshopController = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const platform_express_1 = require("@nestjs/platform-express");
const workshop_service_1 = require("./workshop.service");
const passport_1 = require("@nestjs/passport");
let WorkshopController = class WorkshopController {
    constructor(workshopService, logger) {
        this.workshopService = workshopService;
        this.logger = logger;
    }
    async fileUpload(file) {
        const fileUrl = `${file['path']}`;
        this.logger.info(`Start uploading ${file['filename']} into folder ${file['path']}`);
        return { fileUrl: fileUrl };
    }
    register(regWorkshopDto) {
        return this.workshopService.register(regWorkshopDto);
    }
    getWorkshop(workshopID) {
        return this.workshopService.getWorkshop(workshopID);
    }
    getWsList(num) {
        return this.workshopService.getWsList(num);
    }
    updateWorkshop(workshopID, updateWorkshopDto) {
        return this.workshopService.updateWorkshop(workshopID, updateWorkshopDto);
    }
    delWorkshop(workshopID) {
        return this.workshopService.delWorkshop(workshopID);
    }
    getSub(readerID) {
        return this.workshopService.getSub(readerID);
    }
    getSubList(workshopID) {
        return this.workshopService.getSubList(workshopID);
    }
    getSubName(subID) {
        return this.workshopService.getSubName(subID);
    }
    subWorkshop(subWorkshopDto) {
        return this.workshopService.subWorkshop(subWorkshopDto);
    }
    unsubWorkshop(workshopID, unsubWsDto) {
        return this.workshopService.unsubWorkshop(workshopID, unsubWsDto);
    }
};
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Post('/upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkshopController.prototype, "fileUpload", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Post('/register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "register", null);
__decorate([
    common_1.Get('/profile/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "getWorkshop", null);
__decorate([
    common_1.Get('/get/:num'),
    __param(0, common_1.Param('num')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "getWsList", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Patch('/update/:id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "updateWorkshop", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('lib-jwt')),
    common_1.Delete('/del/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "delWorkshop", null);
__decorate([
    common_1.Get('/getsub/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "getSub", null);
__decorate([
    common_1.Get('/getsublist/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "getSubList", null);
__decorate([
    common_1.Get('/getsubname/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "getSubName", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('reader-jwt')),
    common_1.Post('/subscribe'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "subWorkshop", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('reader-jwt')),
    common_1.Patch('/unsubscribe/:id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "unsubWorkshop", null);
WorkshopController = __decorate([
    common_1.Controller('api/workshop'),
    __param(1, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [workshop_service_1.WorkshopService, Object])
], WorkshopController);
exports.WorkshopController = WorkshopController;
//# sourceMappingURL=workshop.controller.js.map
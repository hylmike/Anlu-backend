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
const workshop_service_1 = require("./workshop.service");
let WorkshopController = class WorkshopController {
    constructor(workshopService) {
        this.workshopService = workshopService;
    }
    register(regWorkshopDto) {
        return this.workshopService.register(regWorkshopDto);
    }
    getWorkshop(workshopID) {
        return this.workshopService.getWorkshop(workshopID);
    }
    updateWorkshop(workshopID, updateWorkshopDto) {
        return this.workshopService.updateWorkshop(workshopID, updateWorkshopDto);
    }
    getSubList(workshopID) {
        return this.workshopService.getSubList(workshopID);
    }
    subWorkshop(subWorkshopDto) {
        return this.workshopService.subWorkshop(subWorkshopDto);
    }
    unsubWorkshop(workshopID, unsubWsDto) {
        return this.workshopService.unsubWorkshop(workshopID, unsubWsDto);
    }
};
__decorate([
    common_1.Post('/register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "register", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "getWorkshop", null);
__decorate([
    common_1.Patch('/:id/update'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "updateWorkshop", null);
__decorate([
    common_1.Get('/:id/getsublist'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "getSubList", null);
__decorate([
    common_1.Post('/subscribe'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "subWorkshop", null);
__decorate([
    common_1.Patch('/:id/unsubscribe'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkshopController.prototype, "unsubWorkshop", null);
WorkshopController = __decorate([
    common_1.Controller('api/workshop'),
    __metadata("design:paramtypes", [workshop_service_1.WorkshopService])
], WorkshopController);
exports.WorkshopController = WorkshopController;
//# sourceMappingURL=workshop.controller.js.map
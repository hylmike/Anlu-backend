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
exports.FrontLogController = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const frontLogInterface_1 = require("./frontLogInterface");
let FrontLogController = class FrontLogController {
    constructor(logger) {
        this.logger = logger;
    }
    postLog(logInterface) {
        return null;
    }
};
__decorate([
    common_1.Post('api/log'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [frontLogInterface_1.NGXLogInterface]),
    __metadata("design:returntype", void 0)
], FrontLogController.prototype, "postLog", null);
FrontLogController = __decorate([
    common_1.Controller(''),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], FrontLogController);
exports.FrontLogController = FrontLogController;
//# sourceMappingURL=front-log.controller.js.map
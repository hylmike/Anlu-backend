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
exports.EmailerController = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("../reader/token.service");
const emailer_service_1 = require("./emailer.service");
let EmailerController = class EmailerController {
    constructor(emailerService, tokenService) {
        this.emailerService = emailerService;
        this.tokenService = tokenService;
    }
    async sendResetEmail(input) {
        const tokenDoc = await this.tokenService.createToken(input.email);
        if (tokenDoc) {
            return this.emailerService.sendResetEmail(input.email, tokenDoc);
        }
    }
};
__decorate([
    common_1.Post('/sendresetmail'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailerController.prototype, "sendResetEmail", null);
EmailerController = __decorate([
    common_1.Controller('api/emailer'),
    __metadata("design:paramtypes", [emailer_service_1.EmailerService,
        token_service_1.TokenService])
], EmailerController);
exports.EmailerController = EmailerController;
//# sourceMappingURL=emailer.controller.js.map
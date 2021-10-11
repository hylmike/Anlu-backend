"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailerModule = void 0;
const common_1 = require("@nestjs/common");
const emailer_service_1 = require("./emailer.service");
const emailer_controller_1 = require("./emailer.controller");
const reader_module_1 = require("../reader/reader.module");
let EmailerModule = class EmailerModule {
};
EmailerModule = __decorate([
    common_1.Module({
        imports: [reader_module_1.ReaderModule],
        providers: [emailer_service_1.EmailerService],
        controllers: [emailer_controller_1.EmailerController],
    })
], EmailerModule);
exports.EmailerModule = EmailerModule;
//# sourceMappingURL=emailer.module.js.map
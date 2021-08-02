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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const nest_winston_1 = require("nest-winston");
require("dotenv/config");
const reader_service_1 = require("../reader/reader.service");
const librarian_service_1 = require("../librarian/librarian.service");
let AuthService = class AuthService {
    constructor(readerService, libService, logger) {
        this.readerService = readerService;
        this.libService = libService;
        this.logger = logger;
    }
    async validateReader(username, password) {
        const reader = await this.readerService.findOne(username);
        if (!reader) {
            console.log('Incorrect username in reader login, please check');
            return null;
        }
        const match = await bcrypt.compare(password, reader.password);
        if (match) {
            reader.password = null;
            this.logger.info(`Reader ${reader.username} username & password validation passed`);
            return reader;
        }
        this.logger.warn(`Incorrect password in reader ${reader.username} login`);
        return null;
    }
    async validateLibrarian(username, password) {
        const librarian = await this.libService.findOne(username);
        if (!librarian) {
            console.log('Incorrect username in librarian login');
            return null;
        }
        const match = await bcrypt.compare(password, librarian.password);
        if (match) {
            librarian.password = null;
            this.logger.info(`Lib ${librarian.username} username & password validation passed`);
            return librarian;
        }
        this.logger.warn(`Incorrect password in lib ${librarian.username} login`);
        return null;
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [reader_service_1.ReaderService,
        librarian_service_1.LibrarianService, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
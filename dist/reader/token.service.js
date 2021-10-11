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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nest_winston_1 = require("nest-winston");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
let TokenService = class TokenService {
    constructor(tokenModel, readerModel, logger) {
        this.tokenModel = tokenModel;
        this.readerModel = readerModel;
        this.logger = logger;
    }
    async createToken(email) {
        const token = crypto.randomBytes(16).toString('hex');
        const hash = await bcrypt.hash(token, 10);
        const reader = await this.readerModel.findOne({ email });
        let tokenDoc = await this.tokenModel.findOne({
            readerName: reader.username,
        });
        if (tokenDoc) {
            tokenDoc.token = hash;
            tokenDoc.createTime = new Date();
        }
        else {
            tokenDoc = new this.tokenModel({
                readerName: reader.username,
                email: email,
                token: hash,
                createTime: new Date(),
            });
        }
        try {
            tokenDoc = await tokenDoc.save();
            this.logger.info(`Success create password reset token for reader ${tokenDoc.readerName}`);
            return { readerName: tokenDoc.readerName, token: token };
        }
        catch (err) {
            this.logger.error(`Failed to save reset token into database: ${err}`);
            return null;
        }
    }
    async verifyToken(readerName, tokenInfo) {
        const tokenDoc = await this.tokenModel.findOne({ readerName });
        if (!tokenDoc) {
            this.logger.warn(`Can't find token for reader ${readerName}`);
            return false;
        }
        const result = await bcrypt.compare(tokenInfo, tokenDoc.token);
        const now = new Date();
        const period = (now.getTime() - tokenDoc.createTime.getTime()) / 1000;
        if (result) {
            if (period <= Number(process.env.RESET_TOKEN_VALID_TIME)) {
                return true;
            }
            else {
                this.delToken(readerName);
                return false;
            }
        }
        else {
            return false;
        }
    }
    async delToken(readerName) {
        const tokenDoc = await this.tokenModel.findOneAndDelete({ readerName });
        return tokenDoc.readerName;
    }
    async resetPwd(resetDto) {
        const verResult = this.verifyToken(resetDto.username, resetDto.token);
        if (!verResult) {
            this.logger.warn(`Wrong password reset token or token expired`);
            return null;
        }
        const reader = await this.readerModel.findOne({
            username: resetDto.username,
        });
        const hash = await bcrypt.hash(resetDto.newPassword, 10);
        reader.password = hash;
        try {
            await reader.save();
            this.logger.info(`Success reset password for reader ${reader.username}`);
            this.delToken(reader.username);
            return JSON.stringify(reader.username);
        }
        catch (err) {
            this.logger.error(`Failed to save reader during password reset: ${err}`);
        }
    }
    async verifyEmail(email) {
        const reader = await this.readerModel.findOne({ email });
        if (reader && reader.username) {
            this.logger.info(`Success validate email for uesr ${reader.username}`);
            return JSON.stringify(reader.username);
        }
        else {
            this.logger.warn(`Email validation failed for ${email}`);
            return null;
        }
    }
};
TokenService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Token')),
    __param(1, mongoose_1.InjectModel('Reader')),
    __param(2, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map
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
exports.LibrarianService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const nest_winston_1 = require("nest-winston");
const jwt_1 = require("@nestjs/jwt");
require("dotenv/config");
let LibrarianService = class LibrarianService {
    constructor(logger, libModel, optLogModel, jwtService) {
        this.logger = logger;
        this.libModel = libModel;
        this.optLogModel = optLogModel;
        this.jwtService = jwtService;
    }
    async register(registerLibDto) {
        const username = registerLibDto.username.trim();
        const role = registerLibDto.role.toLowerCase() === 'admin' ? 'admin' : 'librarian';
        if (username === '') {
            this.logger.warn('Username or form is empty, register failed');
            return null;
        }
        else if (await this.findOne(username)) {
            this.logger.warn(`The username ${username} exists, ${role} register failed`);
            return null;
        }
        else if (registerLibDto.password !== registerLibDto.confirmPassword) {
            this.logger.warn(`Passwords mismatched, register ${role} ${username} failed`);
            return null;
        }
        const hash = await bcrypt.hash(registerLibDto.confirmPassword, 10);
        const newLib = new this.libModel({
            username: registerLibDto.username,
            password: hash,
            email: registerLibDto.email,
            role: registerLibDto.role,
            firstName: registerLibDto.firstName,
            lastName: registerLibDto.lastName,
            phoneNumber: registerLibDto.phoneNumber,
            registerDate: new Date(),
        });
        try {
            const lib = await newLib.save();
            this.logger.info(`Success register ${lib.role} ${lib.username}`);
            return lib;
        }
        catch (err) {
            this.logger.error(`Saving new ${role} ${newLib.username} into database failed: ${err}`);
            return null;
        }
    }
    async getAllAdmin() {
        const adminList = await this.libModel.find({ role: 'Admin' });
        if (adminList) {
            this.logger.info('Success get admin list from database');
            return adminList;
        }
        this.logger.warn("Can't get admin list from database");
        return null;
    }
    async getAllLibrarian() {
        const libList = await this.libModel.find({ role: 'Librarian' });
        if (libList) {
            this.logger.info('Success get librarian list from database');
            return libList;
        }
        this.logger.warn("Can't get librarian list from database");
        return null;
    }
    async getProfile(libID) {
        const lib = await this.libModel.findById(libID);
        if (!lib) {
            this.logger.warn(`Librarian ${libID} does not exist, get profile failed`);
            return null;
        }
        this.logger.info(`Success get ${lib.role} ${lib.username} profile`);
        return lib;
    }
    async updateProfile(updateLibDto) {
        const lib = await this.libModel.findOne({
            username: updateLibDto.username,
        });
        if (!lib) {
            this.logger.warn(`Can not find the librarian ${updateLibDto.username} in updateProfile module`);
            return null;
        }
        for (const item in updateLibDto) {
            switch (item) {
                case 'username':
                    break;
                case 'isActive':
                    const value = updateLibDto[item].toLowerCase() === 'active' ? true : false;
                    if (value !== lib[item])
                        lib[item] = value;
                    break;
                default:
                    if (updateLibDto[item] !== lib[item])
                        lib[item] = updateLibDto[item];
            }
        }
        try {
            const updatedLib = await lib.save();
            this.logger.info(`Successful update profile of ${lib.role} ${lib.username}`);
            return updatedLib._id;
        }
        catch (err) {
            this.logger.error(`Saving updated ${lib.role} ${lib.username} into database failed: ${err}`);
            return null;
        }
    }
    async changePwd(changeLibPwdDto) {
        const lib = await this.libModel
            .findOne({ username: changeLibPwdDto.username })
            .select('+password')
            .exec();
        if (!lib) {
            this.logger.warn(`Can not find librarian ${changeLibPwdDto.username} in change password module`);
            return null;
        }
        const match = await bcrypt.compare(changeLibPwdDto.currentPassword, lib.password);
        if (!match) {
            this.logger.warn(`Wrong current password when changing it for ${lib.role} ${lib.username}`);
            return null;
        }
        lib.password = await bcrypt.hash(changeLibPwdDto.newPassword, 10);
        try {
            const newLib = await lib.save();
            this.logger.info(`Success changed the password for ${newLib.role} ${newLib.username}`);
            return JSON.stringify(newLib.username);
        }
        catch (err) {
            this.logger.error(`Saving ${lib.role} ${lib.username} failed when updating password: ${err}`);
            return null;
        }
    }
    async login(request, requiredRole) {
        const libID = request.user._id;
        const role = request.user.role;
        if (role.toLowerCase() !== requiredRole) {
            this.logger.warn(`User does not have ${requiredRole} role, login failed`);
            return null;
        }
        const accessToken = this.getJwtAccessToken(libID);
        const refreshToken = this.getCookieJwtRefreshToken(libID);
        await this.setRefreshToken(refreshToken[1], libID);
        request.res.setHeader('Set-Cookie', refreshToken[0]);
        this.logger.info(`Success login for ${role} ${request.user.username}.`);
        return {
            token_info: accessToken,
            expireIn: process.env.ACCESS_TOKEN_TIMER,
        };
    }
    async findOne(username) {
        const lib = await this.libModel
            .findOne({ username: username })
            .select('+password')
            .exec();
        return lib;
    }
    async getRefreshById(libID) {
        const lib = await this.libModel
            .findById(libID)
            .select('+currentRefreshToken')
            .exec();
        if (!lib) {
            this.logger.warn(`Could not find the librarian ${libID} when getting refresh token`);
        }
        return lib;
    }
    getJwtAccessToken(libID) {
        const payload = { libID };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_TIMER,
        });
        this.logger.info(`Success setup access token for librarian ${libID}`);
        return accessToken;
    }
    async setRefreshToken(refresh_token, libID) {
        const updateLib = await this.libModel.findById(libID);
        if (!updateLib) {
            this.logger.warn(`Could not find the librarian ${libID} when saving refresh token`);
            return null;
        }
        const hash_token = await bcrypt.hash(refresh_token, 10);
        updateLib.currentRefreshToken = hash_token;
        try {
            const lib = await updateLib.save();
            this.logger.info(`Success save refreshtoken in database`);
            return lib.username;
        }
        catch (err) {
            this.logger.error(`Saving refresh token failed for ${updateLib.role} ${libID}: ${err}`);
            return null;
        }
    }
    getCookieJwtRefreshToken(libID) {
        const payload = { libID };
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: process.env.REFRESH_TOKEN_TIMER,
        });
        const maxAge = +process.env.REFRESH_TOKEN_TIMER.slice(0, -1);
        const cookieRefreshToken = `Refresh=${refreshToken}; HttpOnly; Path=/api/lib/refresh; Max-Age=${maxAge}`;
        this.logger.info(`Success setup refresh token for ${libID}.`);
        return [cookieRefreshToken, refreshToken];
    }
    async refreshTokenValidate(refreshToken, libID) {
        const lib = await this.getRefreshById(libID);
        if (!lib) {
            console.log(`Can not find librarian with ${libID} in refreshtoken validation`);
            return null;
        }
        const match = await bcrypt.compare(refreshToken, lib.currentRefreshToken);
        if (match) {
            this.logger.info(`Refresh token validation for ${lib.role} ${lib.username}passeded`);
            return lib;
        }
        this.logger.warn(`Mismatch refresh token, validation for ${lib.role} ${lib.username} failed`);
        return null;
    }
    tokenRefresh(request) {
        const libID = request.user._id;
        const role = request.user.role;
        const accessToken = this.getJwtAccessToken(libID);
        this.logger.info(`Success refresh  accessToken for ${role} ${libID}`);
        return {
            token_info: accessToken,
            expireIn: process.env.ACCESS_TOKEN_TIMER,
        };
    }
    async logout(request) {
        const libID = request.user._id;
        const role = request.user.role;
        await this.libModel.updateOne({ _id: libID }, { currentRefreshToken: null });
        const deleteCookie = 'Refresh=; HttpOnly; path=/api; Max-Age=0';
        request.res.setHeader('Set-Cookie', deleteCookie);
        this.logger.info(`Success logout for ${role} ${libID}`);
        return libID;
    }
    async deleteLib(libID) {
        const result = await this.libModel.findByIdAndRemove(libID);
        if (result) {
            this.logger.info(`Success delete lib ${libID}`);
            return JSON.stringify(libID);
        }
        else {
            this.logger.warn(`Falied to delete lib ${libID}`);
            return null;
        }
    }
    async addOperationLog(optLogDto) {
        if (optLogDto.operation.trim() === '') {
            this.logger.warn(`No operation content, did not create any oepration log`);
            return null;
        }
        else if (await this.optLogModel.findOne({
            time: new Date(optLogDto.time),
            operation: optLogDto.operation,
        })) {
            this.logger.warn(`Log already exists, did not create anything`);
            return null;
        }
        let newOptLog = new this.optLogModel({
            operator: optLogDto.operator,
            time: new Date(optLogDto.time),
            operation: optLogDto.operation,
            details: optLogDto.details,
        });
        try {
            newOptLog = await newOptLog.save();
            this.logger.info(`Success add operation log ${newOptLog._id}`);
            return newOptLog;
        }
        catch (err) {
            this.logger.error(`Saving operation log failed: ${err}`);
            return null;
        }
    }
    async getOperationLog(libID) {
        const optLog = await this.optLogModel.find({ operator: libID }).exec();
        this.logger.info(`Success get operation log for ${libID}`);
        return optLog;
    }
    async checkAdmin(libID) {
        const lib = await this.libModel.findById(libID);
        if (lib && lib.role.toLowerCase() == 'admin') {
            this.logger.info(`ChecnAdmin success`);
            return true;
        }
        else if (!lib) {
            this.logger.warn(`Can't find ${libID} in database, checnAdmin failed`);
            return null;
        }
        this.logger.info(`ChecnAdmin success`);
        return false;
    }
};
LibrarianService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, mongoose_2.InjectModel('Librarian')),
    __param(2, mongoose_2.InjectModel('OperationLog')),
    __metadata("design:paramtypes", [Object, mongoose_1.Model,
        mongoose_1.Model,
        jwt_1.JwtService])
], LibrarianService);
exports.LibrarianService = LibrarianService;
//# sourceMappingURL=librarian.service.js.map
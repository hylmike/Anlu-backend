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
exports.EmailerService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const mailer_1 = require("@nestjs-modules/mailer");
const reader_interface_1 = require("../reader/reader.interface");
let EmailerService = class EmailerService {
    constructor(mailerService, logger) {
        this.mailerService = mailerService;
        this.logger = logger;
    }
    sendResetEmail(email, tokenDoc) {
        const resetUrl = `${process.env.WEBSITE_URL}reader/resetpwd/${tokenDoc.readerName}/${tokenDoc.token}`;
        this.mailerService
            .sendMail({
            to: email,
            from: 'anlubibliotheque@gmail.com',
            subject: 'Reset Account Password',
            text: `Hello,\n 
        We have receved a request to reset the password for reader account associated with ${email}, no changes have been made to your account yet. Now you can reset your password with link below:\n
        ${resetUrl}\n
        If you haven't request this, please let us know immediately by replying this email. Thank for your cooperation!\n ---AnluBiblio`,
            html: `<p>Hello,<br /><br />We have receved a request to reset the password for reader account associated with <b>${email}</b>, no changes have been made to your account yet. Now you can reset your password with link below:</p>
        <a href="${resetUrl}">Reset Your Password</a><br />
        <p>If you haven't request this, please let us know immediately by replying this email. Thanks for your cooperation!<br /><br /> ---AnluBiblio<p>`,
        })
            .then(() => this.logger.info(`Success send email for ${tokenDoc.readerName} password reset`))
            .catch((err) => {
            this.logger.error(`Failed to send reset password email: ${err}`);
        });
        return tokenDoc.token;
    }
};
EmailerService = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [mailer_1.MailerService, Object])
], EmailerService);
exports.EmailerService = EmailerService;
//# sourceMappingURL=emailer.service.js.map
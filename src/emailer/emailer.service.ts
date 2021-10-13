import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from 'winston';

@Injectable()
export class EmailerService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  sendResetEmail(email: string, tokenDoc): string {
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
      .then(() =>
        this.logger.info(
          `Success send email for ${tokenDoc.readerName} password reset`,
        ),
      )
      .catch((err) => {
        this.logger.error(`Failed to send reset password email: ${err}`);
      });
    return tokenDoc.token;
  }
}

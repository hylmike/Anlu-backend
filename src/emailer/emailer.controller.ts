import { Body, Controller, Post } from '@nestjs/common';
import { TokenService } from 'src/reader/token.service';
import { EmailerService } from './emailer.service';

@Controller('api/emailer')
export class EmailerController {
  constructor(
    private readonly emailService: EmailerService,
    private readonly tokenService: TokenService,
  ) { }

  @Post('/sendresetmail')
  async sendResetEmail(@Body() input: { email: string }) {
    const tokenDoc = await this.tokenService.createToken(input.email);
    if (tokenDoc) {
      return this.emailService.sendResetEmail(input.email, tokenDoc);
    }
  }
}

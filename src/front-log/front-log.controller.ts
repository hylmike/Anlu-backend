import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { NGXLogInterface } from './frontLogInterface';

@Controller('')
export class FrontLogController {

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  @Post('api/log')
  postLog(@Body() logInterface: NGXLogInterface) {
    return null;
  }
}

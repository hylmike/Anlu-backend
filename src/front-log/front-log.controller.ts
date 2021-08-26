import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as fs from 'fs';

import { NGXLogInterface } from './frontLogInterface';

@Controller('')
export class FrontLogController {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  @Post('api/log')
  postLog(@Body() logInterface: NGXLogInterface) {
    fs.writeFile(
      'frontendError.log',
      `level: ${logInterface.level}, timestamp: ${logInterface.timestamp}, message: ${logInterface.message}`,
      { flag: 'a' },
      function (err) {
        if (err) this.logger.error(`Write frontend error file failed: ${err}`);
      },
    );
  }
}

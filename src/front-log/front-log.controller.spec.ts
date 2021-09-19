import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { logger } from '../../test/util/winston';
import { FrontLogController } from './front-log.controller';

describe('FrontLogController', () => {
  let controller: FrontLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
      controllers: [FrontLogController],
    }).compile();

    controller = module.get<FrontLogController>(FrontLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FrontLogController } from './front-log.controller';

describe('FrontLogController', () => {
  let controller: FrontLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrontLogController],
    }).compile();

    controller = module.get<FrontLogController>(FrontLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

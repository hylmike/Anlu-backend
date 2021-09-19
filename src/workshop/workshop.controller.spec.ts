import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { fileToBuffer } from '../book/__mocks__/mockFile';
import { Readable } from 'stream';
import { logger } from '../../test/util/winston';
import {
  workshopStub,
  subscriberStub,
  subscriberData1,
  subscriberData2,
} from './test/stubs/workshop.stub';
import { WorkshopController } from './workshop.controller';
import {
  RegisterWorkshopDto,
  UpdateWorkshopDto,
  SubWorkshopDto,
  UnsubWorkshopDto,
} from './workshop.dto';
import { Workshop, Subscriber } from './workshop.interface';
import { WorkshopService } from './workshop.service';
import { readerStub } from '../reader/test/stubs/reader.stub';

jest.mock('./workshop.service');

describe('WorkshopController', () => {
  let workshopController: WorkshopController;
  let workshopService: WorkshopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkshopController],
      providers: [
        WorkshopService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    workshopController = module.get<WorkshopController>(WorkshopController);
    workshopService = module.get<WorkshopService>(WorkshopService);
  });

  it('should be defined', () => {
    expect(workshopController).toBeDefined();
  });

  describe('fileUpload', () => {
    describe('when fileUpload is called', () => {
      let returnValue: { fileUrl: string };
      let uploadFile: Express.Multer.File;

      beforeEach(async () => {
        const fileBuffer = (await fileToBuffer(
          __dirname + '/test/sample.png',
        )) as Buffer;
        const myStreamBuffer = Readable.from(fileBuffer);
        uploadFile = {
          buffer: fileBuffer,
          fieldname: 'fieldname-defined-in-@UseInterceptors-decorator',
          originalname: 'original-filename',
          encoding: '7bit',
          mimetype: 'file-mimetyp',
          destination: '/fileUpload',
          filename: 'file-name',
          path: 'file-path',
          size: 1800000,
          stream: myStreamBuffer,
        };
        returnValue = await workshopController.fileUpload(uploadFile);
      });

      test('then it should return uploaded file url', async () => {
        expect(returnValue.fileUrl).toEqual(uploadFile.path);
      });
    });
  });

  describe('register', () => {
    describe('when register is called', () => {
      let workshop: Workshop;
      let registerWsDto: RegisterWorkshopDto;

      beforeEach(async () => {
        registerWsDto = {
          topic: workshopStub().topic,
          place: workshopStub().place,
          organizer: workshopStub().organizer,
          startTime: workshopStub().startTime.toString(),
          duration: workshopStub().duration.toString(),
          poster: workshopStub().poster,
          creator: workshopStub().creator,
          remark: workshopStub().remark,
        };
        workshop = await workshopController.register(registerWsDto);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.register).toHaveBeenCalledWith(registerWsDto);
      });

      test('it should return new workshop object', async () => {
        expect(workshop).toEqual(workshopStub());
      });
    });
  });

  describe('getWorkshop', () => {
    describe('when getWorkshop is called', () => {
      let workshop: Workshop;

      beforeEach(async () => {
        workshop = await workshopController.getWorkshop(workshopStub()._id);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.getWorkshop).toHaveBeenCalledWith(
          workshopStub()._id,
        );
      });

      test('it should return an workshop object', async () => {
        expect(workshop).toEqual(workshopStub());
      });
    });
  });

  describe('getWsList', () => {
    describe('when getWsList is called', () => {
      let wsList: Workshop[];

      beforeEach(async () => {
        wsList = await workshopController.getWsList(3);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.getWsList).toHaveBeenCalledWith(3);
      });

      test('it should return an workshop list', async () => {
        expect(wsList).toEqual([workshopStub()]);
        expect(wsList.length).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('updateWorkshop', () => {
    describe('when updateWorkshop is called', () => {
      let workshop: Workshop;
      let updateWsDto: UpdateWorkshopDto;

      beforeEach(async () => {
        updateWsDto = {
          topic: workshopStub().topic,
          place: 'new place',
          organizer: workshopStub().organizer,
          startTime: workshopStub().startTime.toString(),
          duration: workshopStub().duration.toString(),
          poster: workshopStub().poster,
          remark: workshopStub().remark,
        };
        workshop = await workshopController.updateWorkshop(
          workshopStub()._id,
          updateWsDto,
        );
      });

      test('it should call workshopService', async () => {
        expect(workshopService.updateWorkshop).toHaveBeenCalledWith(
          workshopStub()._id,
          updateWsDto,
        );
      });

      test('it should return updated workshop object', async () => {
        expect(workshop).toEqual(workshopStub());
      });
    });
  });

  describe('delWorkshop', () => {
    describe('when delWorkshop is called', () => {
      let workshopID: string;

      beforeEach(async () => {
        workshopID = await workshopController.delWorkshop(workshopStub()._id);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.delWorkshop).toHaveBeenCalledWith(workshopStub()._id);
      });

      test('it should return an workshop list', async () => {
        expect(workshopID).toEqual(workshopStub()._id);
      });
    });
  });

  describe('getSub', () => {
    describe('when getSub is called', () => {
      let sub: Subscriber;

      beforeEach(async () => {
        sub = await workshopController.getSub(subscriberStub().readerID);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.getSub).toHaveBeenCalledWith(subscriberStub().readerID);
      });

      test('it should return an subscriber object', async () => {
        expect(sub).toEqual(subscriberStub());
      });
    });
  });

  describe('getSubName', () => {
    describe('when getSubName is called', () => {
      let subName: string;

      beforeEach(async () => {
        subName = await workshopController.getSubName(subscriberStub()._id);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.getSubName).toHaveBeenCalledWith(subscriberStub()._id);
      });

      test('it should return related reader name', async () => {
        expect(subName).toEqual(readerStub().username);
      });
    });
  });

  describe('subWorkshop', () => {
    describe('when subWorkshop is called', () => {
      let sub: Subscriber;
      let subWsDto: SubWorkshopDto;

      beforeEach(async () => {
        subWsDto = {
          workshop: subscriberStub().workshop,
          readerID: subscriberStub().readerID,
        };
        sub = await workshopController.subWorkshop(subWsDto);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.subWorkshop).toHaveBeenCalledWith(subWsDto);
      });

      test('it should return new subscriber object', async () => {
        expect(sub).toEqual(subscriberStub());
      });
    });
  });

  describe('getSubList', () => {
    describe('when getSubList is called', () => {
      let subList: Subscriber[];

      beforeEach(async () => {
        subList = await workshopController.getSubList(workshopStub()._id);
      });

      test('it should call workshopService', async () => {
        expect(workshopService.getSubList).toHaveBeenCalledWith(
          workshopStub()._id,
        );
      });

      test('it should return subscriber list of the workshop', async () => {
        expect(subList).toEqual([subscriberData1, subscriberData2]);
      });
    });
  });

  describe('unsubWorkshop', () => {
    describe('when unsubWorkshop is called', () => {
      let subID: string;
      let unsubDto: UnsubWorkshopDto;

      beforeEach(async () => {
        unsubDto = {
          subID: subscriberStub()._id,
        };
        subID = await workshopController.unsubWorkshop(
          workshopStub()._id,
          unsubDto,
        );
      });

      test('it should call workshopService', async () => {
        expect(workshopService.unsubWorkshop).toHaveBeenCalledWith(
          workshopStub()._id,
          unsubDto,
        );
      });

      test('it should return deleted subscriber id for the workshop', async () => {
        expect(subID).toEqual(subscriberStub()._id);
      });
    });
  });
});

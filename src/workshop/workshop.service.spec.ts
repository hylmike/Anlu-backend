import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopService } from './workshop.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MongooseModule } from '@nestjs/mongoose';

import {
  mongooseTestModule,
  closeMongodConnection,
} from '../schemas/test/mongo.test.module';
import { WorkshopSchema, SubscriberSchema } from '../schemas/workshop.schema';
import { logger } from '../../test/util/winston';
import { Workshop, Subscriber } from './workshop.interface';
import {
  RegisterWorkshopDto,
  UpdateWorkshopDto,
  SubWorkshopDto,
  UnsubWorkshopDto,
} from './workshop.dto';
import {
  workshopStub,
  workshopData,
  subscriberStub,
  subscriberData1,
  subscriberData2,
} from './test/stubs/workshop.stub';
import { ReaderSchema } from '../schemas/reader.schema';

jest.mock('winston');

describe('WorkshopService', () => {
  let workshopService: WorkshopService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Workshop', schema: WorkshopSchema },
          { name: 'Subscriber', schema: SubscriberSchema },
          { name: 'Reader', schema: ReaderSchema },
        ]),
      ],
      providers: [
        WorkshopService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    workshopService = module.get<WorkshopService>(WorkshopService);
    jest.clearAllMocks();
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
        workshop = await workshopService.register(registerWsDto);
      });

      test('it should return new workshop object', async () => {
        workshopData._id = workshop._id;
        subscriberData1.workshop = workshop._id;
        subscriberData2.workshop = workshop._id;
        expect(workshop.topic).toEqual(workshopStub().topic);
        expect(workshop.startTime).toEqual(workshopStub().startTime);
        expect(workshop.createTime).not.toEqual(workshopStub().createTime);
      });

      test('it should return null for existing workshop (duplicated topic)', async () => {
        expect(workshop).toBeNull;
      });
    });
  });

  describe('getWorkshop', () => {
    describe('when getWorkshop is called', () => {
      let workshop: Workshop;

      beforeEach(async () => {
        workshop = await workshopService.getWorkshop(workshopStub()._id);
      });

      test('it should return an workshop object', async () => {
        expect(workshop.topic).toEqual(workshopStub().topic);
        expect(workshop.startTime).toEqual(workshopStub().startTime);
      });

      test('it should return null for invalid workshop id', async () => {
        expect(await workshopService.getWorkshop(null)).toBeNull;
      });
    });
  });

  describe('getWsList', () => {
    describe('when getWsList is called', () => {
      let wsList: Workshop[];

      beforeEach(async () => {
        wsList = await workshopService.getWsList(3);
      });

      test('it should return an workshop list', async () => {
        expect(wsList.length).toEqual(1);
        expect(wsList[0].topic).toEqual(workshopStub().topic);
      });
    });
  });

  describe('updateWorkshop', () => {
    describe('when updateWorkshop is called', () => {
      let workshop: Workshop;
      let updateWsDto: UpdateWorkshopDto;
      const newPlace = 'New place';
      const newTime = '2020-07-20T16:00:00Z';

      beforeEach(async () => {
        updateWsDto = {
          topic: workshopStub().topic,
          place: newPlace,
          organizer: workshopStub().organizer,
          startTime: newTime,
          duration: workshopStub().duration.toString(),
          poster: workshopStub().poster,
          remark: workshopStub().remark,
        };
        workshop = await workshopService.updateWorkshop(
          workshopStub()._id,
          updateWsDto,
        );
      });

      test('it should return updated workshop object', async () => {
        expect(workshop.place).toEqual(newPlace);
        expect(workshop.startTime).toEqual(new Date(newTime));
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
        sub = await workshopService.subWorkshop(subWsDto);
      });

      test('it should return new subscriber object', async () => {
        subscriberData1._id = sub._id;
        expect(sub.workshop).toEqual(subscriberStub().workshop);
        expect(sub.readerID).toEqual(subscriberStub().readerID);
      });

      test('it should return null for existing subscriber', async () => {
        expect(sub).toBeNull;
      });
    });
  });

  describe('getSub', () => {
    describe('when getSub is called', () => {
      let sub: Subscriber;

      beforeEach(async () => {
        sub = await workshopService.getSub(subscriberStub().readerID);
      });

      test('it should return an workshop list', async () => {
        expect(sub.workshop).toEqual(workshopStub()._id);
      });
    });
  });

  describe('getSubList', () => {
    describe('when getSubList is called', () => {
      let subList: Subscriber[];

      beforeEach(async () => {
        const subWsDto = {
          workshop: subscriberData2.workshop,
          readerID: subscriberData2.readerID,
        };
        await workshopService.subWorkshop(subWsDto);
        subList = await workshopService.getSubList(workshopStub()._id);
      });

      test('it should return an subscriber list with right data', async () => {
        expect(subList.length).toEqual(2);
        expect(subList[1].readerID).toEqual(subscriberData2.readerID);
      });
    });
  });

  describe('unsubWorkshop', () => {
    describe('when unsubWorkshop is called', () => {
      let subscriberID: Workshop;

      beforeEach(async () => {
        const unsubDto: UnsubWorkshopDto = {
          subID: subscriberStub()._id,
        };
        subscriberID = await workshopService.unsubWorkshop(
          workshopStub()._id,
          unsubDto,
        );
      });

      test('it should delete subscriber and return deleted subscriber id', async () => {
        const subList = await workshopService.getSubList(workshopStub()._id);
        const sub = await workshopService.getSub(subscriberStub()._id);
        expect(subList.length).toEqual(1);
        expect(sub).toBeNull;
        expect(subscriberID).toEqual(subscriberStub()._id);
      });

      test('it should return null for non-exist subscriber', async () => {
        expect(subscriberID).toBeNull;
      });
    });
  });

  describe('delWorkshop', () => {
    describe('when delWorkshop is called', () => {
      let result: string;

      beforeEach(async () => {
        result = await workshopService.delWorkshop(workshopStub()._id);
      });

      test('it should return an workshop id', async () => {
        expect(result).toEqual(JSON.stringify(workshopStub()._id));
      });
    });
  });

  afterAll(async () => {
    closeMongodConnection();
    jest.clearAllMocks();
  });
});

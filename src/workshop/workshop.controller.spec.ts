import { Test, TestingModule } from '@nestjs/testing';
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

jest.mock('./workshop.service');

describe('WorkshopController', () => {
  let workshopController: WorkshopController;
  let workshopService: WorkshopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkshopController],
      providers: [WorkshopService],
    }).compile();

    workshopController = module.get<WorkshopController>(WorkshopController);
    workshopService = module.get<WorkshopService>(WorkshopService);
  });

  it('should be defined', () => {
    expect(workshopController).toBeDefined();
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
          duration: workshopStub().duration,
          flyerContent: workshopStub().flyerContent,
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

  describe('updateWorkshop', () => {
    describe('when updateWorkshop is called', () => {
      let workshop: Workshop;
      let updateWsDto: UpdateWorkshopDto;

      beforeEach(async () => {
        updateWsDto = {
          place: workshopStub().place,
          organizer: '',
          startTime: workshopStub().startTime.toString(),
          duration: '',
          flyerContent: workshopStub().flyerContent,
          remark: '',
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

  describe('subWorkshop', () => {
    describe('when subWorkshop is called', () => {
      let sub: Subscriber;
      let subWsDto: SubWorkshopDto;

      beforeEach(async () => {
        subWsDto = {
          workshop: subscriberStub().workshop,
          firstName: subscriberStub().firstName,
          lastName: subscriberStub().lastName,
          age: subscriberStub().age,
          neighborhood: subscriberStub().neighborhood,
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

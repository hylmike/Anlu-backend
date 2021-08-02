import {
  subscriberStub,
  workshopStub,
  subscriberData1,
  subscriberData2,
} from '../test/stubs/workshop.stub';

export const WorkshopService = jest.fn().mockReturnValue({
  register: jest.fn().mockResolvedValue(workshopStub()),
  getWorkshop: jest.fn().mockResolvedValue(workshopStub()),
  updateWorkshop: jest.fn().mockResolvedValue(workshopStub()),
  subWorkshop: jest.fn().mockResolvedValue(subscriberStub()),
  unsubWorkshop: jest.fn().mockResolvedValue(subscriberStub()._id),
  getSubList: jest.fn().mockResolvedValue([subscriberData1, subscriberData2]),
});

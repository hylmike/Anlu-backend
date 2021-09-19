import { readerStub } from '../../reader/test/stubs/reader.stub';
import {
  subscriberStub,
  workshopStub,
  subscriberData1,
  subscriberData2,
} from '../test/stubs/workshop.stub';

export const WorkshopService = jest.fn().mockReturnValue({
  register: jest.fn().mockResolvedValue(workshopStub()),
  getWorkshop: jest.fn().mockResolvedValue(workshopStub()),
  getWsList: jest.fn().mockResolvedValue([workshopStub()]),
  updateWorkshop: jest.fn().mockResolvedValue(workshopStub()),
  delWorkshop: jest.fn().mockResolvedValue(workshopStub()._id),
  subWorkshop: jest.fn().mockResolvedValue(subscriberStub()),
  unsubWorkshop: jest.fn().mockResolvedValue(subscriberStub()._id),
  getSub: jest.fn().mockResolvedValue(subscriberStub()),
  getSubList: jest.fn().mockResolvedValue([subscriberData1, subscriberData2]),
  getSubName: jest.fn().mockResolvedValue(readerStub().username),
});

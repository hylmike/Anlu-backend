"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopService = void 0;
const reader_stub_1 = require("../../reader/test/stubs/reader.stub");
const workshop_stub_1 = require("../test/stubs/workshop.stub");
exports.WorkshopService = jest.fn().mockReturnValue({
    register: jest.fn().mockResolvedValue(workshop_stub_1.workshopStub()),
    getWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.workshopStub()),
    getWsList: jest.fn().mockResolvedValue([workshop_stub_1.workshopStub()]),
    updateWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.workshopStub()),
    delWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.workshopStub()._id),
    subWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.subscriberStub()),
    unsubWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.subscriberStub()._id),
    getSub: jest.fn().mockResolvedValue(workshop_stub_1.subscriberStub()),
    getSubList: jest.fn().mockResolvedValue([workshop_stub_1.subscriberData1, workshop_stub_1.subscriberData2]),
    getSubName: jest.fn().mockResolvedValue(reader_stub_1.readerStub().username),
});
//# sourceMappingURL=workshop.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopService = void 0;
const workshop_stub_1 = require("../test/stubs/workshop.stub");
exports.WorkshopService = jest.fn().mockReturnValue({
    register: jest.fn().mockResolvedValue(workshop_stub_1.workshopStub()),
    getWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.workshopStub()),
    updateWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.workshopStub()),
    subWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.subscriberStub()),
    unsubWorkshop: jest.fn().mockResolvedValue(workshop_stub_1.subscriberStub()._id),
    getSubList: jest.fn().mockResolvedValue([workshop_stub_1.subscriberData1, workshop_stub_1.subscriberData2]),
});
//# sourceMappingURL=workshop.service.js.map
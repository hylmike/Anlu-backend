"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriberStub = exports.subscriberData2 = exports.subscriberData1 = exports.workshopStub = exports.workshopData = void 0;
exports.workshopData = {
    _id: '60ec4c554d1fbb29cd893e9e',
    topic: 'Woskshop Sample',
    place: 'Our library main meeting room',
    organizer: 'Johnthan',
    subscriber: ['60ec5713bb91d82c72fe91c2', '60ec587c16899e2d1607f3cc'],
    startTime: new Date('2020-07-20T00:00:00Z'),
    duration: 2,
    flyerContent: 'New book launch event of <My Story>',
    creator: 'michael',
    createTime: new Date('2020-07-18T00:11:00Z'),
    remark: '',
};
const workshopStub = () => {
    return exports.workshopData;
};
exports.workshopStub = workshopStub;
exports.subscriberData1 = {
    _id: '60ec5713bb91d82c72fe91c2',
    workshop: '60ec4c554d1fbb29cd893e9e',
    firstName: 'Tom',
    lastName: 'Jackson',
    age: 30,
    neighborhood: 'CloudValley',
    SubscribeTime: new Date('2020-07-19T00:00:00Z'),
};
exports.subscriberData2 = {
    _id: '60ec587c16899e2d1607f3cc',
    workshop: '60ec4c554d1fbb29cd893e9e',
    firstName: 'Mike',
    lastName: 'Anderson',
    age: 35,
    neighborhood: 'CloudValley',
    SubscribeTime: new Date('2020-07-19T10:00:00Z'),
};
const subscriberStub = () => {
    return exports.subscriberData1;
};
exports.subscriberStub = subscriberStub;
//# sourceMappingURL=workshop.stub.js.map
import { Subscriber, Workshop } from '../../workshop.interface';

export const workshopData: Workshop = {
  _id: '60ec4c554d1fbb29cd893e9e',
  topic: 'Woskshop Sample',
  place: 'Our library main meeting room',
  organizer: 'Johnthan',
  subscriber: ['60ec5713bb91d82c72fe91c2', '60ec587c16899e2d1607f3cc'],
  startTime: new Date('2020-07-20T00:00:00Z'),
  duration: 2,
  poster: 'New book launch event of <My Story>',
  creator: 'michael',
  createTime: new Date('2020-07-18T00:11:00Z'),
  remark: '',
};

export const workshopStub = (): Workshop => {
  return workshopData;
};

export const subscriberData1: Subscriber = {
  _id: '60ec5713bb91d82c72fe91c2',
  workshop: '60ec4c554d1fbb29cd893e9e',
  readerID: '60e914e8b5dafaf6b7b0d8b7',
  SubscribeTime: new Date('2020-07-19T00:00:00Z'),
};

export const subscriberData2: Subscriber = {
  _id: '60ec587c16899e2d1607f3cc',
  workshop: '60ec4c554d1fbb29cd893e9e',
  readerID: '60e91512b5dafaf6b7b0d8bc',
  SubscribeTime: new Date('2020-07-19T10:00:00Z'),
};

export const subscriberStub = (): Subscriber => {
  return subscriberData1;
};

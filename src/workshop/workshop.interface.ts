import { Document } from 'mongoose';

export interface Workshop {
  _id: string;
  topic: string;
  place: string;
  organizer: string;
  subscriber: string[];
  startTime: Date;
  duration: number;
  flyerContent: string;
  creator: string;
  createTime: Date;
  remark: string;
}

export type WorkshopDocument = Workshop & Document;

export interface Subscriber {
  _id: string;
  workshop: string;
  firstName: string;
  lastName: string;
  age: number;
  neighborhood: string;
  SubscribeTime: Date;
}

export type SubscriberDocument = Subscriber & Document;

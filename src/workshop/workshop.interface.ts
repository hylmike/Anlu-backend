import { Document } from 'mongoose';

export interface Workshop {
  _id: string;
  topic: string;
  place: string;
  organizer: string;
  subscriber: string[];
  startTime: Date;
  duration: number;
  poster: string;
  creator: string;
  createTime: Date;
  remark: string;
}

export type WorkshopDocument = Workshop & Document;

export interface Subscriber {
  _id: string;
  workshop: string;
  readerID: string;
  //neighborhood: string;
  SubscribeTime: Date;
}

export type SubscriberDocument = Subscriber & Document;

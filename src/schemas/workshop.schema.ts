import * as mongoose from 'mongoose';

export const WorkshopSchema = new mongoose.Schema({
  topic: String,
  place: String,
  organizer: String,
  subscriber: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscriber',
    },
  ],
  startTime: Date,
  duration: Number, //unit: hour
  flyerContent: String,
  creator: String, //creator id
  createTime: Date,
  remark: String,
});

export const SubscriberSchema = new mongoose.Schema({
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
  },
  firstName: String,
  lastName: String,
  age: Number,
  neighborhood: String,
  SubscribeTime: Date,
});

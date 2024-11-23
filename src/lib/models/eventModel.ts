import { model, models, Schema } from "mongoose";
// interface IEvent extends Document {
//   _id:string,
//   title: string;
//   description: string;
//   eventImage: string;
//   startDateTime: Date;
//   endDateTime: Date;
//   location?: string;
//   isPaid: boolean;
//   price: number;
//   totalSeats: number;
//   bookedSeats: number;
//   eventType: 'online' | 'offline';
//   qrCode?: string;
//   host: Schema.Types.ObjectId;
//   category: Schema.Types.ObjectId[],
//   attendees: Schema.Types.ObjectId[];
//   createdAt: Date;
// }

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventImage: { type: String, required: true },
  startDateTime: { type: Date, required: true , default:Date.now},
  endDateTime: { type: Date, required: true ,default:Date.now},
  location: { type: String, required: true },
  isPaid: { type: Boolean, default: false }, // Indicates if the event is paid
  price: { type: Number, default: 0 }, // Price of the event if it's paid
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 }, // Track booked seats
  eventType: { type: String, enum: ['online', 'offline'], required: true },
  qrCode: { type: String }, // Store QR code data or URL
  host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // category: { type:String, enum:["meetup", "seminar", "workshop", "webinar", "exhibition"]},
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users who have RSVPed
  createdAt: { type: Date, default: Date.now },
});

const Event = models.Event || model('Event', eventSchema);

export default Event;

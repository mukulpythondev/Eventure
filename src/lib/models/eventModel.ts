import mongoose, { model, models, Schema } from "mongoose";
interface IEvent extends Document {
  _id:string,
  title: string;
  description: string;
  eventImage: string;
  startDateTime: Date;
  endDateTime: Date;
  venue?: string;
  isPaid: boolean;
  price: number;
  totalSeats: number;
  bookedSeats: number;
  eventType: 'online' | 'offline';
  qrCode?: string;
  host: mongoose.Types.ObjectId; // Changed to ObjectId
  category: string,
  attendees: string[];
  createdAt: Date;
  hostEmail:string
}

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventImage: { type: String, required: true },
  startDateTime: { type: Date, required: true , default:Date.now},
  endDateTime: { type: Date, required: true ,default:Date.now},
  venue: { type: String, required: true },
  isPaid: { type: Boolean, default: false }, // Indicates if the event is paid
  price: { type: Number, default: 0 }, // Price of the event if it's paid
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 }, // Track booked seats
  eventType: { type: String, enum: ['online', 'offline'], required: true },
  qrCode: { type: String }, // Store QR code data or URL
  host: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  category: { type:String, enum:["meetup", "seminar", "workshop", "webinar", "exhibition","masterclass"]},
  // category: { type:String, required:true },
  attendees: [{type:String}], // Users who have RSVPed
  createdAt: { type: Date, default: Date.now },
  hostEmail: {type: String, required: true}
});

const Event = models.Event || model<IEvent>('Event', eventSchema);

export default Event;
import  { model, models, Schema } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  profile:{type:String, required:true},
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique:true },
  userName: { type: String, required: true, unique:true },
  rsvps: [{ type: Schema.Types.ObjectId, ref: 'Event' }], // Events the user has RSVPed to
  hostedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }], // Events hosted by the user
}, {
  timestamps:true
});

const User = models.User ||  model('User', userSchema);

export default User;

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const appointmentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
  bookingDate: {
    type: Date,
  },
});
const appointment = model('Appointment', appointmentSchema);
export default appointment;

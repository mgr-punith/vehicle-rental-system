import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    vehicleType: { type: String, required: true, trim: true },
    rentPerDay: {
      type: Number,
      required: true,
      min: [1, 'Rent per day must be greater than zero'],
    },
    status: {
      type: String,
      enum: ['Available', 'Booked'],
      default: 'Available',
    },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
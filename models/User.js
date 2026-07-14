import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  line1: String,
  line2: String,
  city: String,
  state: String,
  pin: String,
  phone: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  phone:    { type: String, default: '' },
  role:     { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  preferences: {
    newsletter: { type: Boolean, default: false },
    smsAlerts:  { type: Boolean, default: false },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

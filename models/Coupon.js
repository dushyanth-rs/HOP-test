import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType:  { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, default: 0 },
  expiryDate:    { type: Date, required: true },
  usageLimit:    { type: Number, default: null },
  timesUsed:     { type: Number, default: 0 },
  active:        { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

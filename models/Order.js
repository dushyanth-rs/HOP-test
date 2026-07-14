import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:        String,
  image:       String,
  size:        String,
  quantity:    Number,
  unitPrice:   Number,
}, { _id: false });

const addressSnapshotSchema = new mongoose.Schema({
  name:  String,
  phone: String,
  line1: String,
  line2: String,
  city:  String,
  state: String,
  pin:   String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestSessionId: { type: String, default: null },
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending_payment',
  },
  items:           [orderItemSchema],
  shippingAddress: addressSnapshotSchema,
  subtotal:        { type: Number, required: true },
  discountAmount:  { type: Number, default: 0 },
  couponCode:      { type: String, default: null },
  shippingCharge:  { type: Number, default: 0 },
  total:           { type: Number, required: true },
  razorpayOrderId:   { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  notes:             { type: String, default: '' },
}, { timestamps: true });

orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ razorpayOrderId: 1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);

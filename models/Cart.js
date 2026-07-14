import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size:     { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  addedAt:  { type: Date, default: Date.now },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId:     { type: String, default: null },
  items:         [cartItemSchema],
  expiresAt:     { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
}, { timestamps: true });

cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);

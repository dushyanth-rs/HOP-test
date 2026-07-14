import mongoose from 'mongoose';

const customerEventSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, default: null },
  eventType: {
    type: String,
    enum: ['page_view', 'product_view', 'search', 'add_to_cart', 'wishlist_add', 'checkout_start', 'purchase'],
    required: true,
  },
  metadata:  { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now },
});

customerEventSchema.index({ user: 1, timestamp: -1 });
customerEventSchema.index({ sessionId: 1 });
customerEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export default mongoose.models.CustomerEvent || mongoose.model('CustomerEvent', customerEventSchema);

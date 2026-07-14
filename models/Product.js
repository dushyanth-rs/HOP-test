import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url:   { type: String, required: true },
  angle: { type: String, default: 'Front' },
  order: { type: Number, default: 0 },
}, { _id: false });

const sizeVariantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, required: true, unique: true, lowercase: true },
  shortStory:       { type: String, default: '' },
  story:            { type: String, default: '' },
  fabricDetails:    { type: String, default: '' },
  careInstructions: { type: String, default: '' },
  price:            { type: Number, required: true, min: 0 },
  salePrice:        { type: Number, default: null },
  category: {
    type: String,
    enum: ['shirts', 't-shirts', 'polos', 'jackets', 'blazers', 'bottomwear', 'accessories'],
    required: true,
  },
  collection: {
    type: String,
    enum: ['executive', 'heritage', 'limited-editions', 'new-arrivals', 'best-sellers'],
    default: 'new-arrivals',
  },
  status:  { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
  images:  [imageSchema],
  sizes:   [sizeVariantSchema],
  tags:    [String],
  views:   { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ name: 'text', story: 'text', shortStory: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema);

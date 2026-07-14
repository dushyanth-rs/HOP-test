import mongoose from 'mongoose';

const journalArticleSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  slug:         { type: String, required: true, unique: true, lowercase: true },
  body:         { type: String, required: true },
  excerpt:      { type: String, default: '' },
  category: {
    type: String,
    enum: ['Leadership', 'Style', 'Politics', 'Culture', 'Entrepreneurship', 'History', 'Personal Branding', 'Fashion'],
    required: true,
  },
  authorName:    { type: String, default: 'The HOP Editorial Team' },
  coverImage:    { type: String, default: '' },
  readTime:      { type: Number, default: 5 },
  featured:      { type: Boolean, default: false },
  status:        { type: String, enum: ['published', 'draft'], default: 'draft' },
  publishedDate: { type: Date, default: null },
}, { timestamps: true });

journalArticleSchema.index({ slug: 1 });
journalArticleSchema.index({ status: 1, publishedDate: -1 });

export default mongoose.models.JournalArticle || mongoose.model('JournalArticle', journalArticleSchema);

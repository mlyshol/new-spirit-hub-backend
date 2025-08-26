import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ItemDoc extends Document {
  href: string;
  source?: string;
  category?: string;
  type?: string;
  accent?: string;
  title?: string;
  description?: string;
  originalDate?: Date;
  publishedDate?: Date;
  date?: Date;
  createdAt?: Date;
  published: boolean;
}

const ItemSchema = new Schema<ItemDoc>(
  {
    href: { type: String, required: true, unique: true },
    source: { type: String },
    category: { type: String },
    type: { type: String },
    accent: { type: String },
    title: { type: String },
    description: { type: String },
    originalDate: { type: Date },
    publishedDate: { type: Date },
    date: { type: Date },
    createdAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: false } // ✅ default false
  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

const Item: Model<ItemDoc> =
  mongoose.models.Item || mongoose.model<ItemDoc>('Item', ItemSchema);

export default Item;
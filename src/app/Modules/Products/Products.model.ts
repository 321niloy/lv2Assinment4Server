import { model, Schema } from 'mongoose';
import { Tproducts } from './Products.interface';

const productSchema = new Schema<Tproducts>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true, // This will add `createdAt` and `updatedAt` fields
  },
);

///
productSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

// Create and export the model
export const Product = model<Tproducts>('Product', productSchema);
export const Cart = model<Tproducts>('Cart', productSchema);

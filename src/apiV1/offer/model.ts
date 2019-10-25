import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

interface IOffer {
  userEmail: string,
  amount: number,
  rate: number,
  minCreditScore: number,
  maxPeriod: number
}

const OfferSchema = new Schema({
  userEmail: String,

  amount: {
    type: Number,
    min: 1
  },

  rate: {
    type: Number,
    min: 1
  },

  minCreditScore: {
    type: Number,
    min: 0,
    max: 5
  },

  maxPeriod: {
    type: Number,
    min: 1
  }
}, {
  timestamps: true,
  useNestedStrict: true
});

interface IOfferModel extends IOffer, Document {
  // Just to please typescript
}

export default mongoose.model<IOfferModel>('Offer', OfferSchema);
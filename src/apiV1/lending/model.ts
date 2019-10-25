import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface ILending {
  userId: Schema.Types.ObjectId,
  loanId: Schema.Types.ObjectId,
  amount: number,
  rate: number,
  minCreditScore: number,
  maxPeriod: number
}

const LendingSchema = new Schema({
  userId: Schema.Types.ObjectId,

  loanId: Schema.Types.ObjectId,

  amount: {
    type: Number,
    min: 1
  },

  rate: {
    type: Number,
    min: 1
  },

  period: {
    type: Number,
    min: 1
  },

  dueDate: {
    type: Date
  },
}, {
  timestamps: true,
  useNestedStrict: true
});

interface ILendingModel extends ILending, Document {
  // Just to please typescript
}

export default mongoose.model<ILendingModel>('Lending', LendingSchema);
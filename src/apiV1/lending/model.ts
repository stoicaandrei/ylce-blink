import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface ILending {
  userEmail: string,
  loanId: string,
  amount: number,
  rate: number,
  period: number,
  paybackAmount: number
}

const LendingSchema = new Schema({
  userEmail: {
    type: String
  },

  loanId: {
    type: String
  },

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

  paybackAmount: {
    type: Number
  }
}, {
  timestamps: true,
  useNestedStrict: true
});

interface ILendingModel extends ILending, Document {
  // Just to please typescript
}

export default mongoose.model<ILendingModel>('Lending', LendingSchema);
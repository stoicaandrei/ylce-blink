import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface ILending {
  userEmail: string,
  loanId: string,
  amount: number,
  rate: number,
  minCreditScore: number,
  maxPeriod: number
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
}, {
  timestamps: true,
  useNestedStrict: true
});

interface ILendingModel extends ILending, Document {
  // Just to please typescript
}

export default mongoose.model<ILendingModel>('Lending', LendingSchema);
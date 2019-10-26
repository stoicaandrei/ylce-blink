import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface ILoan {
  approved: boolean,
  userEmail: string,
  amount: number,
  rate: number,
  period: number,
  dueDate: Date,
  paybackAmount: number,
  backers: [{
    userEmail: string,
    amount: number,
    rate: number
  }]
}

const LoanSchema = new Schema({
  approved: {
    type: Boolean
  },

  userEmail: {
    type: String
  },

  amount: {
    type: Number
  },

  rate: {
    type: Number,
    min: 1.0
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
  },

  backers: [{
    userEmail: String,
    amount: Number,
    rate: Number
  }]
}, {
  timestamps: true,
  useNestedStrict: true
});

interface ILoanModel extends ILoan, Document {
  // Just to please typescript
}

export default mongoose.model<ILoanModel>('Loan', LoanSchema);
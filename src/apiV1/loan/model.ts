import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

interface ILoan {
  approved: boolean,
  userId: Schema.Types.ObjectId,
  amount: number,
  rate: number,
  period: number,
  dueDate: Date
}

const LoanSchema = new Schema({
  approved: {
    type: Boolean
  },

  userId: Schema.Types.ObjectId,

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
}, {
  timestamps: true,
  useNestedStrict: true
});

interface ILoanModel extends ILoan, Document {
  // Just to please typescript
}

export default mongoose.model<ILoanModel>('Loan', LoanSchema);
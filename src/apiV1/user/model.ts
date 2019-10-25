import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface IUser {
  email: string,
  password: string,
  birthDate: Date,
  country: string,
  employmentIndustry: string,
  incomeBracket: string,
  amount: number
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    match: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    required: true,
    trim: true,
    index: true
  },

  password: {
    type: String,
    required: true,
    trim: true
  },

  firstName: {
    type: String,
    trim: true
  },

  lastName: {
    type: String,
    trim: true
  },

  birthDate: {
    type: Date
  },

  country: {
    type: String
  },

  employmentIndustry: {
    type: String
  },

  incomeBracket: {
    type: String
  },

  amount: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true,
  useNestedStrict: true
});

interface IUserModel extends IUser, Document {
  // Just to please typescript
}

export default mongoose.model<IUserModel>('User', UserSchema);
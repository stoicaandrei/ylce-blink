import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose'

interface IUser {
  name: string,
  lastName: string,
  email: string,
  password: string
}

interface IUserModel extends IUser, Document {
  // Just to please typescript
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    match: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  useNestedStrict: true
});

export default mongoose.model<IUserModel>('User', UserSchema);
import mongoose from 'mongoose';
import CONFIG from './config';

import uniqueValidator from 'mongoose-unique-validator';

mongoose.set('useCreateIndex', true);

export default (async () => {
  try {
    mongoose.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

    // TODO
    mongoose.plugin((schema: mongoose.Schema) => {
      schema.pre('findOneAndUpdate', setRunValidators);
      schema.pre('updateMany', setRunValidators);
      schema.pre('updateOne', setRunValidators);
      schema.pre('update', setRunValidators);
    });

    await mongoose.connect(
      CONFIG.DB_HOST,
      { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    );
  } catch (err) {
    console.log(`${err} \nCould not Connect to the Database. Exiting Now...`);
    process.exit();
  }
})()

function setRunValidators(this: any) {
  (this as any).setOptions({ runValidators: true, new: true });
}
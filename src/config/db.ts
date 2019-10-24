import mongoose from 'mongoose';
import CONFIG from './config';

mongoose.set('useCreateIndex', true);

export default (async () => {
  try {
    await mongoose.connect(
      CONFIG.DB_HOST,
      { useNewUrlParser: true }
    );
  } catch (err) {
    console.log(`${err} \nCould not Connect to the Database. Exiting Now...`);
    process.exit();
  }
})()
import mongoose, { ConnectOptions } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI || '[your_URI_here]';

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'zealthy-helpdesk-tickets-jdv724',
    } as ConnectOptions);
    console.log('Connected to Mongo DB.');
  } catch (err) {
    console.error(err);
  }
};

export default connectToDatabase;

import mongoose, { ConnectOptions } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI || '<your_uri_here>';

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'zealthy-helpdesk-tickets-jdv724',
    } as ConnectOptions);
    console.log('connected to mongo db!');
  } catch (err) {
    console.error(err);
  }
};

export default connectToDatabase;

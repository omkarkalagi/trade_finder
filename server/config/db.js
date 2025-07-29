import mongoose from 'mongoose';

const connectDB = async () => {
  // Check if MONGO_URI is set
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is not defined');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

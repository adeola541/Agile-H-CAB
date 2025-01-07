import connectDB from '../backend/config/database';

const testConnection = async () => {
  try {
    const conn = await connectDB();
    console.log('Successfully connected to MongoDB!');
    await conn.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

testConnection();

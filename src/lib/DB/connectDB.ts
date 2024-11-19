import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDb(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    const DB = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
    connection.isConnected = DB.connections[0].readyState;
    console.log("Connection to the database was successful.");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default connectDb;

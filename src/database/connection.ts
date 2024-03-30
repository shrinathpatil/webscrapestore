import mongoose from "mongoose";

let isConnected = false;

export const getConnected = async () => {
  mongoose.set("strictQuery", true);
  try {
    if (isConnected) {
      console.log("already connected!");
      return;
    }

    const url = process.env.MONGODB_URL!;
    const connection = await mongoose.connect(url);

    isConnected = connection.connections[0].readyState === 1;
    console.log("connection established!");
  } catch (error) {
    console.log("Error connecting to MongoDb");
  }
};

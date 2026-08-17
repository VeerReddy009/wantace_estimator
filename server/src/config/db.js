import mongoose from "mongoose";

export async function connectDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing. Add it to your server .env file.");
  }

  await mongoose.connect(connectionString);
}

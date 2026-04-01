import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: String,
  value: Number
});

export default mongoose.model("counter", counterSchema, "counter");
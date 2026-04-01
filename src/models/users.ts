// importing the required modules
import mongoose from "mongoose";


// creating schema

const userSchema = new mongoose.Schema({
    username: "string",
    password: "string",
    location: "string"
})

// exporting the model
export default mongoose.model("Users", userSchema, "users");

// Created the Schema for User model
// This file is used to define the User model schema for MongoDB using Mongoose

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        gender:{
            type: String,
            // required: true,
        },
        bio: {
            type: String,
            default: "",
        },
        profilePicture: {
            type: String,
            default: "",
        },
        nativeLanguage: {
            type: String,
            default: "",
        },
        learningLanguage: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
        friends:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {timestamps:true}
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next(); // Only hash if password is modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); 
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }  
})

userSchema.methods.matchPassword = async function (enterPassword) {
    const isPasswordCorrect = await bcrypt.compare(enterPassword, this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);
export default User;

// Created the Schema for FriendRequest model
// This file is used to define the FriendRequest model schema for MongoDB using Mongoose

import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        recipient:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'accepted'],
            default: 'pending'
        },
    },
    {
        timestamps: true,
    }
);

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequest;
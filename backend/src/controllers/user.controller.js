import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

// Recommended users controller
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id; // Assuming req.user is set by protectRoute middleware
        const currentUser = req.user;

        const recommnendedUsers = await User.find({
            $and: [
                {_id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude friends of current user
                {isOnboarded: true} // Only include users who are onboarded
            ]
        })
        res.status(200).json(recommnendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller:", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

// My friends controller
export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "firstName lastName profilePicture nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller:", error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id; // Assuming req.user is set by protectRoute middleware
        const {id: recipientId} = req.params;

        // prevent sending friend request to self
        if(myId === recipientId) {
            return res.status(400).json({message: "You cannot send a friend request to yourself."});
        }

        // Check if the recipient exists
        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({message: "Recipient not found."});
        }

        // check if the recipient is already a friend
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({message: "You are already friends with this user."});
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
        })

        if(existingRequest) {
            return res.status(400).json({message: "Friend request already exists."});
        }

        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });
        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error in sendFriendRequest controller:", error.message);
        res.status(500).json({message:"Internal server error"});        
    }
}
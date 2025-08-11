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

// Send friend request controller
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

// Accept friend request controller
export async function acceptFriendRequest(req, res){
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) {
            return res.status(404).json({message: "Friend request not found."});
        }
        //verify the current user is the recipient of the request
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to accept this friend request."});
        }
        
        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each other as friends
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: { friends: friendRequest.recipient }
        });
        
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet: { friends: friendRequest.sender }
        });
        
        res.status(200).json({message: "Friend request accepted successfully."});

    } catch (error) {
        console.log("Error in acceptFriendRequest controller:", error.message);
        res.status(500).json({message: "Internal server error"});            
    }
}

// check for incoming friend requests
export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id, 
            status: "pending"}).populate("sender", "firstName lastName profilePicture nativeLanguage learningLanguage");

            const acceptedReqs = await FriendRequest.find({
                sender: req.user.id,
                status: "accepted"}).populate("recipient", "firstName lastName profilePicture");

        res.status(200).json({
            incomingRequests: incomingReqs,
            acceptedRequests: acceptedReqs
        });

    } catch (error) {
        console.log("Error in getFriendRequests controller:", error.message);
        res.status(500).json({message: "Internal server error"});
        
    }
}

// Get outgoing friend requests
export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "firstName lastName profilePicture nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);

    } catch (error) {
        console.log("Error in getOutgoingFriendRequests controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }

}
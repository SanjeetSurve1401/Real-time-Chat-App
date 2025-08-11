// This file is used to define the user routes for handling user-related operations
// such as getting recommended users, friends, and sending friend requests

import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { get } from 'mongoose';
import { 
    acceptFriendRequest, 
    getFriendRequests, 
    getMyFriends, 
    getOutgoingFriendRequests, 
    getRecommendedUsers, 
    sendFriendRequest } 
    from '../controllers/user.controller.js';

const router = express.Router();

router.use(protectRoute); // Protect all routes in this file

router.get("/",getRecommendedUsers)

router.get("/friends",getMyFriends)

router.post("/friend-request/:id", sendFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests",getFriendRequests);

router.get("/outgoing-friend-requests",getOutgoingFriendRequests);

export default router;
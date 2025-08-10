// This file is used to protect routes by verifying JWT tokens
// It checks if the user is authenticated before allowing access to protected routes

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access no token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized access invalid token' });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access user not found' });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}
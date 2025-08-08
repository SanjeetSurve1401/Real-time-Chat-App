import User from "../models/User.js"; // Import the User model
import jwt from "jsonwebtoken"; // Import JWT for token generation

export async function signup(req, res) {
    const {email, password, firstName, lastName} = req.body;

    try {
        
        if(!email || !password || !firstName || !lastName ) {
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }
        
        const idx = Math.floor(Math.random() * 8) + 1; // Randomly select an avatar
        const randomAvatar = `../assets/${idx}.png`;

        const newUser = await User.create({
            email,
            firstName,
            lastName,
            password,
            profilePicture: randomAvatar
        });



        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents XSS attacks
            sameSite: "strict", // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        });

        res.status(201).json({success: true, user: newUser});


    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function login(req, res) {
    res.send("Login Route");
}

export function logout(req, res) {
    res.send("Logout Route");
}

import User from "../models/User.js"; // Import the User model
import jwt from "jsonwebtoken"; // Import JWT for token generation

export async function signup(req, res) {
    const {email, password, firstName, lastName, gender} = req.body;

    try {
        
        if(!email || !password || !firstName || !lastName || !gender) {
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }

        const allowedGenders = ["male","female"];
        if(!allowedGenders.includes(gender.toLowerCase())) {
            return res.status(400).json({message:"Invalid gender value"});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }
        
        // Image Selection Logic
        function getRandomAvatar(gender) {
            const fAvatars = ['F-4', 'F-5', 'F-8'];
            const mAvatars = ['M-1', 'M-2', 'M-3', 'M-6', 'M-7'];

            let avatarPool = gender === 'female' ? fAvatars
                        : gender === 'male' ? mAvatars
                        : [...fAvatars, ...mAvatars]; // fallback

            const idx = Math.floor(Math.random() * avatarPool.length);
            return `../assets/${avatarPool[idx]}.png`;
        }
        const randomAvatar = getRandomAvatar(gender.toLowerCase());

        const newUser = await User.create({
            email,
            firstName,
            lastName,
            gender,
            password,
            profilePicture: randomAvatar
        });

        // JSON Web Token (JWT) generation for Signup
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
    try {
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({message: "Invalid credentials"});

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) return res.status(401).json({message: "Invalid credentials"});

        // JSON Web Token (JWT) generation for Login
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents XSS attacks
            sameSite: "strict", // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        });

        res.status(200).json({success: true, user});

    } catch (error) {   
        console.log("Error in login controller:", error.message);
        res.status(500).json({message: "Internal server error"});
        
    }
}

export function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({message: "Logged out successfully"});
}

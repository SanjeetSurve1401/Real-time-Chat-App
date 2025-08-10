import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js"; // Import the User model
import jwt from "jsonwebtoken"; // Import JWT for token generation

// SIGNUP
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
            const fAvatars = ['F-4', 'F-5', 'F-8', 'F-9', 'F-10', 'F-11', 'F-12', 'F-13', 'F-14', 'F-15', 'F-16', 'F-17', 'F-18', 'F-19', 'F-20', 'F-21', 'F-22', 'F-23'];
            const mAvatars = ['M-1', 'M-2', 'M-3', 'M-6', 'M-7', 'M-24', 'M-25', 'M-26', 'M-27', 'M-28', 'M-29'];

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

        // Uploading data on Stream
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: `${newUser.firstName} ${newUser.lastName}`,
                // name: newUser.firstName,
                image: newUser.profilePicture || "",
            });
            console.log(`Stream user upserted for ${newUser.firstName} ${newUser.lastName}`);
            
        } catch (error) {
            console.log("Error in upserting Stream user:", error);
            
        }

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

// LOGIN
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

// LOGOUT
export function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({message: "Logged out successfully"});
}

// Onboarding
export async function onboard(req, res) {
    try {
        const userId = req.user._id; // Get user ID from the request object
        const{firstName, lastName, bio, nativeLanguage, learningLanguage, location }=req.body

        if(!firstName || !lastName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !firstName && "firstName",
                    !lastName && "lastName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new:true});

        if(!updatedUser) return res.status(404).json({message: "User not found"});
        // Uploading data on Stream
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: `${updatedUser.firstName} ${updatedUser.lastName}`,
                image : updatedUser.profilePicture || "",    
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.firstName} ${updatedUser.lastName}`);
        } catch (StreamError) {
            console.log("Error in updating Stream user during onboarding:", StreamError.message);   
        }
        res.status(200).json({success: true, user: updatedUser});

    } catch (error) {
        console.log("Error in onboard controller:", error);
        res.status(500).json({message: "Internal server error"});        
    }
    
}
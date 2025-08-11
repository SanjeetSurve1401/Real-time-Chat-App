import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken (res, req){
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({ token });

    } catch (error) {
        console.log("Error generating stream token:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}
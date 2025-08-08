import express from "express"// its a web framework and help for creating APIs 
import "dotenv/config"; // to load environment variables from .env file

import authRoutes from "./routes/auth.route.js"; // import the auth routes
import { connectDB } from "./lib/db.js"; // import the database connection function

// Initialize the express application

    
const app = express()
const PORT = process.env.PORT 

app.use(express.json()); // Middleware to parse JSON bodies

// Instead of creating multiple routes in a single file create a separate file for routes
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB(); // Connect to the database
});
import express from "express"// its a web framework and help for creating APIs 
import "dotenv/config"; // to load environment variables from .env file

import authRoutes from "./routes/auth.route.js"; // import the auth routes

    
const app = express()
const PORT = process.env.PORT 


// Instead of creating multiple routes in a single file create a separate file for routes

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
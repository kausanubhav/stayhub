import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from "path"
import { v2 as cloudinary } from "cloudinary"
import helmet from "helmet"
import compression from "compression"

import authRoutes from "./routes/auth"
import userRoutes from "./routes/users"
import myHotelsRoutes from "./routes/my-hotels"
import hotelRoutes from "./routes/hotels"
import bookingRoutes from "./routes/bookings"
import saveSearchRoutes from "./routes/searches"
import recommendationsRoutes from "./routes/recommendations"

const connectionString = process.env.MONGO_CONNECTION_STRING as string
if (!connectionString) {
  throw new Error("MONGO_CONNECTION_STRING environment variable is not set")
}

//Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Mongoose Connection
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB successfully")
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  })

const app = express()

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["self"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com","https://images.unsplash.com"],
        scriptSrc: ["self"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "sameorigin" },
    noSniff: true,
    referrerPolicy: { policy: "no-referrer" },
  })
)

// Adds security-related headers
app.use(compression()) // Compresses responses
//app.use(morgan("combined")) // Logs HTTP requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(cookieParser())
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers.accept?.includes("image/webp")) {
    req.url = req.url.replace(/\.(jpg|jpeg|png)$/, ".webp")
  }
  next()
})
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/my-hotels", myHotelsRoutes)
app.use("/api/hotels", hotelRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/save_search", saveSearchRoutes)
app.use("/api/recommendations", recommendationsRoutes)

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
})

let server = app.listen(7000, () => {
  console.log("Server is running on localhost:7000")
})

//Graceful Shutdown
const shutdown = (signal: NodeJS.Signals) => {
  console.log(`Received ${signal}. Closing HTTP server.`)

  // Stop accepting new connections and wait for ongoing requests to finish
  server.close(async () => {
    console.log("HTTP server closed.")

    try {
      // Close the MongoDB connection
      await mongoose.connection.close()
      console.log("MongoDB connection closed.")
    } catch (error) {
      console.error("Error closing MongoDB connection:", error)
    } finally {
      // Exit the process
      process.exit(0)
    }
  })
}

// Handle termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))

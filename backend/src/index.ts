import express, { Request, Response } from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from 'path'

import authRoutes from "./routes/auth"
import userRoutes from "./routes/users"

const connectionString = process.env.MONGO_CONNECTION_STRING as string
if (!connectionString) {
  throw new Error("MONGO_CONNECTION_STRING environment variable is not set")
}

mongoose
  .connect(connectionString)

const app = express()

app.use(express.static(path.join(__dirname,"../../frontend/dist")))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)

app.listen(7000, () => {
  console.log("Server is running on localhost:7000")
})

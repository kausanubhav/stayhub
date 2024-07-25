import express, { Request, Response } from "express"
import multer from "multer"
//mport { v2 as cloudinary } from "cloudinary"
import FormData from "form-data"
import axios from "axios"
import Hotel, { HotelType } from "../models/hotel"
import { verifyToken } from "../middleware/auth"
import { body } from "express-validator"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

// api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("starRating").notEmpty().isNumeric().withMessage("Rating is required"),
    body("adultCount").notEmpty().isNumeric().withMessage("Adult count is required"),
    body("childCount").notEmpty().isNumeric().withMessage("Child count is required"),

    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[]
      const newHotel: HotelType = req.body

      // Upload the images to cloudinary

      //Approach 1: Using Base64; has additional overhead associated with base64 encoding
      // const uploadPromises = imageFiles.map(async (image) => {
      //   const base64 = Buffer.from(image.buffer).toString("base64")
      //   const dataURI = "data:" + image.mimetype + ";base64," + base64
      //   const res = await cloudinary.uploader.upload(dataURI)
      //   return res.url
      // })

      //Approach 2: Instead of using base64, we will upload directly as binary data; use form-data library for that
      // for files with bigger size
      const uploadToCloudinary = async (file: Express.Multer.File) => {
        const form = new FormData()
        form.append("file", file.buffer, { filename: file.originalname })
        form.append("upload_preset", "my_preset")

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/de41eqe7u/image/upload`
        const response = await axios.post(cloudinaryUrl, form, {
          headers: {
            ...form.getHeaders(),
          },
        })

        return response.data.secure_url
      }

      const uploadPromises = imageFiles.map(uploadToCloudinary)
      const imageUrls = await Promise.all(uploadPromises)

      newHotel.imageUrls = imageUrls
      newHotel.lastUpdated = new Date()
      newHotel.userId = req.userId

      const hotel = new Hotel(newHotel)
      await hotel.save()

      res.status(201).send(hotel)
    } catch (error) {
      console.log("Error creating hotel", error)
      return res.status(500).json({ message: "Something went wrong." })
    }
  }
)

export default router

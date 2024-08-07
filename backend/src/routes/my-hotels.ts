import express, { Request, Response } from "express"
import multer from "multer"
//mport { v2 as cloudinary } from "cloudinary"
import FormData from "form-data"
import axios from "axios"
import sharp from "sharp"

import Hotel from "../models/hotel"
import { HotelType } from "../shared/types"
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
      const imageUrls = await uploadImages(imageFiles)

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

//Get my hotels /api/my-hotels

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId })
    res.status(200).json(hotels)
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" })
  }
})

//Get a hotel with id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString()

  try {
    const hotel = await Hotel.findOne({ _id: id, userId: req.userId })
    res.status(200).json(hotel)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotels" })
  }
})

//Update a hotel
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body
      updatedHotel.lastUpdated = new Date()
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      )

      if (!hotel) return res.status(404).json({ message: "Hotel not found" })

      const files = req.files as Express.Multer.File[]
      const updatedImageUrls = await uploadImages(files)

      hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]

      await hotel.save()
      res.status(201).json(hotel)
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!" })
    }
  }
)

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const convertToWebP = async (buffer: Buffer): Promise<Buffer> => {
    return sharp(buffer).webp().toBuffer()
  }
  const uploadToCloudinary = async (file: Express.Multer.File) => {
    const webpBuffer = await convertToWebP(file.buffer)

    const form = new FormData()
    form.append("file", webpBuffer, { filename: file.originalname })
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
  return imageUrls
}
export default router

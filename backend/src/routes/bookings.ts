import { Booking } from "../models/booking"
import { User } from "../models/user"
import { BookedHotelType } from "../shared/types"
import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { verifyToken } from "../middleware/auth"
import multer from "multer"

const router = express.Router()

const upload = multer({})

router.post(
  "/:id",
  verifyToken,
  upload.none(),
  [
    body("adultCount").notEmpty().isNumeric().withMessage("Adult count is required").toInt(),
    body("childCount").notEmpty().isNumeric().withMessage("Child count is required").toInt(),
    body("checkIn")
      .notEmpty()
      .withMessage("Check in date is required")
      .custom((value) => {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          throw new Error("Check in date must be a valid date")
        }
        return true
      })
      .toDate(),
    body("checkOut")
      .notEmpty()
      .withMessage("Check out date is required")
      .custom((value) => {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          throw new Error("Check out date must be a valid date")
        }
        return true
      })
      .toDate(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

    const bookingData: BookedHotelType = {
      ...req.body,
      hotelId: req.params?.id,
      userId: req.userId,
    }
    const newBooking = new Booking(bookingData)
    try {
      await newBooking.save()

      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { bookedHotels: req.params.id }, // Add hotelId to bookedHotels array if not already present
      })
      return res.status(201).json({ message: "Booking created successfully." })
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." })
    }
  }
)
export default router

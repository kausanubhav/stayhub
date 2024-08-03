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

    try {
      const { checkIn, checkOut } = req.body
      const hotelId = req.params.id
      const userId = req.userId
      
      const normalizeDate=(date:Date)=>{
        const normalized=new Date(date)
        normalized.setHours(0,0,0,0)
        return normalized
      }
       const normalizedCheckIn = normalizeDate(new Date(checkIn))
       const normalizedCheckOut = normalizeDate(new Date(checkOut))

      // Check for existing bookings
      const existingBooking = await Booking.findOne({
        userId,
        hotelId,
        checkIn: normalizedCheckIn,
        checkOut: normalizedCheckOut,
      })

      if (existingBooking) {
        return res.status(409).json({ message: "Booking already exists for this hotel and dates." })
      }

      const bookingData: BookedHotelType = {
        ...req.body,
        hotelId: req.params?.id,
        userId: req.userId,
      }
      const newBooking = new Booking(bookingData)
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

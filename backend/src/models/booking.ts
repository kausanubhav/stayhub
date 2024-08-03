import { BookedHotelType } from "../shared/types"
import mongoose from "mongoose"

export const BookingSchema = new mongoose.Schema<BookedHotelType>(
  {
    userId: { type: String, required: true },
    hotelId: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
  },
  { timestamps: true }
)
export const Booking = mongoose.model<BookedHotelType>("Booking", BookingSchema)

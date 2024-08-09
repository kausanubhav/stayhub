import mongoose from "mongoose"
import { HotelType } from "../shared/types"




const HotelSchema = new mongoose.Schema<HotelType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], 
})
HotelSchema.index({ city: 1, type: 1 })
HotelSchema.index({ city: 1, facilities: 1 })
HotelSchema.index({ country: 1, facilities: 1 })
HotelSchema.index({ country: 1, type: 1 })

const Hotel = mongoose.model<HotelType>("Hotel", HotelSchema)
export default Hotel

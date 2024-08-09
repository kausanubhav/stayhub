import mongoose from "mongoose"
import { ReviewType } from "../shared/types"

const ReviewSchema = new mongoose.Schema<ReviewType>({
  userId: { type: String, required: true },
  data: { type: String, required: true },
  date: { type: Date, required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true }, // Reference to Hotel model
})
ReviewSchema.index({ data: 1, date: 1 })

export const Review = mongoose.model<ReviewType>("Review", ReviewSchema)

import express, { Request, Response } from "express"
import { verifyToken } from "../middleware/auth"
import { body, validationResult } from "express-validator"
import { Review } from "../models/review"
import mongoose from "mongoose"
import Hotel from "../models/hotel"
import { User } from "../models/user"

const router = express.Router()

//add review /api/reviews/id
router.post(
  "/:id",
  verifyToken,
  [body("data").isString().notEmpty().withMessage("Review can not be empty.")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

    const hotelId = req.params.id.toString()
    const userId = req.userId
    const newReview = new Review({
      date: new Date(),
      userId,
      data: req.body.data,
      hotelId: new mongoose.Types.ObjectId(hotelId),
    })

    try {
      await newReview.save()
      await Hotel.findOneAndUpdate(
        { _id: hotelId, userId },
        { $push: { reviews: newReview._id } },
        { new: true }
      )
      const reviewResponse = {
        date: newReview.date.toISOString(),
        data: newReview.data,
      }
      res.status(201).json(reviewResponse)
    } catch (error) {}
  }
)

//get all reviews /api/reviews/id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const hotelId = req.params.id.toString()
  try {
    const reviews = await Review.find({ hotelId })
    const user = await User.findOne({ _id: req.userId })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const mappedReviews = await Promise.all(
      reviews.map(async (review) => {
        const user = await User.findById(review.userId)
        if (!user) {
          throw new Error(`User not found for review with id ${review._id}`)
        }

        return {
          _id: review._id,
          date: review.date.toISOString(),
          data: review.data,
          name: `${user.firstName} ${user.lastName}`, // Concatenate first and last names
        }
      })
    )

    res.status(200).json(mappedReviews)
  } catch (error) {
    res.status(500).send({ message: "Server error." })
  }
})

export default router

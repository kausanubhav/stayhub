import express, { Request, Response } from "express"
import { verifyToken } from "../middleware/auth"
import { body, validationResult } from "express-validator"
import { Search } from "../models/search"
import Hotel from "../models/hotel"

const router = express.Router()

// /api/save_search to save the searches
router.post(
  "/",
  [
    body("query")
      .notEmpty()
      .withMessage("Search term is required.")
      .isString()
      .withMessage("Search term must be a string.")
      .trim()
      .escape(),
  ],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) return res.status(400).json({ message: errors.array() })
    const { query } = req.body

    try {
      if (query.trim().length === 0)
        return res.status(400).json({ message: "Search term can not be empty." })

      //   const existingSearchRecord=await Search.findOne({userId:req.userId,query})
      //   if(existingSearchRecord) return res.status(200).json({message:"Search already recorded."})

      //check if the search term corresponds to a valid hotel
      const hotel = await Hotel.findOne({
        $or: [
          { city: { $regex: new RegExp(query, "i") } },
          { country: { $regex: new RegExp(query, "i") } },
        ],
      })
      if (!hotel) {
        return res.status(400).json({ message: "Invalid search term. No matching hotels found." })
      }

      const searchRecord = await Search.findOneAndUpdate(
        { userId: req.userId, query },
        { userId: req.userId, query },
        { upsert: true, new: true } // Create a new document if no match is found
      )

      return res.status(201).json({ message: "Search processed successfully." })

      return res.status(201).json({ message: "Search saved successfully." })
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error })
    }
  }
)

export default router

import express, { Request, Response } from "express"
import { verifyToken } from "../middleware/auth"
import { Booking } from "../models/booking"
import Hotel from "../models/hotel"
import { Search } from "../models/search"
import mongoose from "mongoose"

const router = express.Router()

// /api/recommendations
router.get("/", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId

  try {
    const recommendations = await getRecommendedHotels(userId)
    //console.log(recommendations)
    res.status(200).json(recommendations)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
})

const getRecommendedHotels = async (userId: string) => {
  const topSearchTerms = await getRelevantSearchTerms(userId)
  const { topFacilities, topTypes } = await getPreferredFacilitiesAndTypes(userId)
  //console.log("-------")
 // console.log("top searchterms are ", topSearchTerms)
 // console.log("top facilities are", topFacilities)
 // console.log("top types are ", topTypes)

 
  //fetches booked hotel ids; used at multiple places, can be refactored.
  const bookings = await Booking.find({ userId })
  const bookedHotelIds = bookings.map((booking) => booking.hotelId)

  const objectIdArray = bookedHotelIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id))
  // Fetch hotels based on search terms
  // Recommends hotels with preferred facilities or type in the country or city being searched frequently.
  const hotels = await Hotel.find({
    $and: [
      {
        $or: [
          {
            $or: [{ city: { $in: topSearchTerms } }, { country: { $in: topSearchTerms } }],
            type: { $in: topTypes },
          },

          {
            $or: [{ city: { $in: topSearchTerms } }, { country: { $in: topSearchTerms } }],
            facilities: { $in: topFacilities },
          },
        ],
      },
      {
        _id: {
          $nin: objectIdArray,
        },
      },
    ],
  }).exec()

  return hotels.slice(0, 6)
}

const getRelevantSearchTerms = async (userId: string): Promise<string[]> => {
  const bookings = await Booking.find({ userId })
  const bookedHotelIds = bookings.map((booking) => booking.hotelId)

  const objectIdArray = bookedHotelIds
    .map((id) => new mongoose.Types.ObjectId(id))
  const bookedHotels = await Hotel.find({ _id: { $in: objectIdArray } })
  //console.log("booked hotels", bookedHotels)
  const hotelCities = bookedHotels.map((hotel) => hotel.city)
  const hotelCountries = bookedHotels.map((hotel) => hotel.country)
  //console.log("hotel cities are", hotelCities, " hotel countries are ", hotelCountries)
  // Fetch searches that resulted in bookings
  const searches = await Search.find({ userId }).exec()
  const searchTerms = searches.map((search) => search.query)

  const relevantSearchTerms = searchTerms.filter(
    (term) => hotelCities.includes(term) || hotelCountries.includes(term)
  )
  const topSearchTerms = relevantSearchTerms.slice(0, 7)
  return topSearchTerms
}

const getPreferredFacilitiesAndTypes = async (userId: string) => {
  // Fetch bookings and extract booked hotel IDs
  const bookings = await Booking.find({ userId }).exec()
  const bookedHotelIds = bookings.map((booking) => booking.hotelId)
  const objectIdArray = bookedHotelIds
    .map((id) => new mongoose.Types.ObjectId(id))
  const bookedHotels = await Hotel.find({ _id: { $in: objectIdArray } }).exec()

  // Analyze facilities and types
  const facilities: string[] = []
  const types: string[] = []

  bookedHotels.forEach((hotel) => {
    facilities.push(...hotel.facilities)
    types.push(hotel.type)
  })

  // Get the most common facilities and types (e.g., top 10)
  const topFacilities = getTopN(facilities, 3)
  const topTypes = getTopN(types, 3)

  return { topFacilities, topTypes }
}

// Helper function to get top N items
const getTopN = (items: string[], n: number) => {
  const counts: Record<string, number> = items.reduce(
    (acc: Record<string, number>, item: string) => {
      acc[item] = (acc[item] || 0) + 1
      return acc
    },
    {}
  )

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([item]) => item)
}
export default router

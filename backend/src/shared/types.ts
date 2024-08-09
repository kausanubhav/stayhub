import mongoose from "mongoose";

  type ReviewType = {
  userId: string
  data: string;
  hotelId:mongoose.Types.ObjectId
  date:Date
}

 type HotelType = {
  _id: string
  userId: string
  name: string
  city: string
  country: string
  description: string
  type: string
  adultCount: number
  childCount: number
  facilities: string[]
  pricePerNight: number
  starRating: number
  imageUrls: string[]
  lastUpdated: Date
  reviews: mongoose.Types.ObjectId[]
}

 type BookedHotelType = {
  _id: string
  userId: string
  hotelId: string
  checkIn: Date
  checkOut: Date
  adultCount: number
  childCount: number
}

 type HotelSearchResponse = {
  data: HotelType[]
  pagination: {
    total: number
    page: number
    pages: number
  }
}


export type { HotelType, HotelSearchResponse, BookedHotelType, ReviewType }
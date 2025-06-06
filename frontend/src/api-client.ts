import { ReviewType } from "./pages/Detail"
import { RegisterFormData } from "./pages/Register"
import { SignInFormData } from "./pages/SignIn"
import { HotelSearchResponse, HotelType } from "@src/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

//Register
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
  const responseBody = await response.json()
  if (!response.ok) {
    console.log("Response is not okay", response)
    throw new Error(responseBody.message)
  }
}

//SignIn
export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
  const body = await response.json()
  console.log("body:", body, "message", body.message)
  if (!response.ok) throw new Error(body.message)
  return body
}

//Signout
export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  })

  if (!response.ok) throw new Error("Error during sign out")
}

//Validate token
export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  })
  if (!response.ok) throw new Error("Token invalid")
  return await response.json()
}

//Add my hotel
export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  })
  if (!response.ok) throw new Error("Failed to add hotel")
  return await response.json()
}

//Get hotels
// export type HotelType = {
//   _id: string
//   userId: string
//   name: string
//   city: string
//   country: string
//   description: string
//   type: string
//   adultCount: number
//   childCount: number
//   facilities: string[]
//   pricePerNight: number
//   starRating: number
//   imageUrls: string[]
//   lastUpdated: Date
// }

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  })
  if (!response.ok) throw new Error("Error fetching hotels")

  return await response.json()
}

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  })
  if (!response.ok) throw new Error("Error fetching hotels")
  return await response.json()
}

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
    credentials: "include",
    method: "PUT",
    body: hotelFormData,
  })
  if (!response.ok) throw new Error("Error fetching hotels")
  return await response.json()
}

//Search hotels

//We have a SearchParamsType in search context as well, but it is for frontend inputs
//SearchParams is for api queries so all fields are string

export type SearchParams = {
  destination?: string
  checkIn?: string
  checkOut?: string
  adultCount?: string
  childCount?: string
  page?: string
  facilities?: string[]
  types?: string[]
  maxPrice?: string
  sortOption?: string
  stars?: string[]
}
export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams()
  queryParams.append("destination", searchParams.destination || "")
  queryParams.append("checkIn", searchParams.checkIn || "")
  queryParams.append("checkOut", searchParams.checkOut || "")
  queryParams.append("adultCount", searchParams.adultCount || "")
  queryParams.append("childCount", searchParams.childCount || "")
  queryParams.append("page", searchParams.page || "")

  queryParams.append("maxPrice", searchParams.maxPrice || "")
  queryParams.append("sortOption", searchParams.sortOption || "")

  searchParams.facilities?.forEach((facility) => queryParams.append("facilities", facility))

  searchParams.types?.forEach((type) => queryParams.append("types", type))
  searchParams.stars?.forEach((star) => queryParams.append("stars", star))

  const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`)
  if (!response.ok) throw new Error("Error fetching hotels")
  return await response.json()
}

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`)
  if (!response.ok) {
    throw new Error("Error fetching hotels")
  }
  return response.json()
}

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`)
  if (!response.ok) {
    throw new Error("Error fetching Hotels")
  }

  return response.json()
}

//book hotels

export const bookHotel = async (hotelBookingFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/bookings/${hotelBookingFormData.get("hotelId")}`,
    {
      credentials: "include",
      method: "POST",
      body: hotelBookingFormData,
    }
  )
  if (!response.ok) {
    const errorData = await response.json()
    const errorMessage = errorData.message || "Error booking hotel"

    if (response.status === 409) throw new Error("Already booked for selected dates.")
    else throw new Error(errorMessage)
  }
  return await response.json()
}

//save search
export const saveSearch = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/api/save_search`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) throw new Error("Error saving search query.")
  return await response.json()
}

//get recommendations
export const getRecommendedHotels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
    credentials: "include",
  })

  if (!response.ok) throw new Error("Error getting recommended results.")
  return await response.json()
}

export const getUserReviews = async (hotelId: string): Promise<ReviewType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${hotelId}`, {
    credentials: "include",
  })

  if (!response.ok) throw new Error("Error getting reviews results.")
  return await response.json()
}

export const addUserReview = async (hotelId: string, review: string) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${hotelId}`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({data:review}),
  })

  if (!response.ok) throw new Error("Error adding review.")
  return await response.json()
}

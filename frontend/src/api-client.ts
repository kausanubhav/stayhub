import { RegisterFormData } from "./pages/Register"
import { SignInFormData } from "./pages/SignIn"

import { HotelType } from "../../backend/src/shared/types.ts"

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
export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  })
  if (!response.ok) throw new Error("Error fetching hotels")

  return await response.json()
}

// seedHotels.ts

import mongoose from "mongoose"
import { faker } from "@faker-js/faker"
import Hotel from "./models/hotel" // Adjust the import path as needed
import "dotenv/config"

// Hotel types and facilities
const hotelTypes = [
  "Boutique",
  "Luxury",
  "Budget",
  "Business",
  "Resort",
  "Airport",
  "Extended Stay",
  "Hostel",
  "Bed and Breakfast",
  "Motels",
  "Eco-Friendly",
  "Pet-Friendly",
  "Spa",
  "Historic",
  "All-Inclusive",
]

const hotelFacilities = [
  "Free Wi-Fi",
  "Pool",
  "Gym",
  "Breakfast",
  "Room Service",
  "Spa",
  "Business Center",
  "Concierge",
  "Shuttle",
  "Restaurant",
]

// Predefined image URLs
const predefinedImageUrls = [
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1490122417551-6ee9691429d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1506059612708-99d6c258160e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1678286769762-b6291545d818?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

let currentIndex = 0

const getNextImageUrls = (count: number): string[] => {
  const urls = []
  for (let i = 0; i < count; i++) {
    urls.push(predefinedImageUrls[currentIndex])
    currentIndex = (currentIndex + 1) % predefinedImageUrls.length // Move to the next index and wrap around
  }
  return urls
}

// Connect to MongoDB
const connectionString =
  "mongodb+srv://kausanubhav2018:eWwtpR2w14JiN6BF@cluster0.prxvtuz.mongodb.net/"
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB successfully")
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  })
// Generate sample hotel data
const generateHotelData = (numHotels: number) => {
  const hotels = []
  for (let i = 0; i < numHotels; i++) {
    const name = faker.company.name()
    const city = faker.location.city()
    const country = faker.location.country()
    const adultCount = faker.number.int({ min: 1, max: 4 }).toString()
    const childCount = faker.number.int({ min: 0, max: 3 }).toString()
    const starRating = faker.number.int({ min: 1, max: 5 }).toString()
    const facilities = faker.helpers.shuffle(hotelFacilities).slice(0, 3) // Random selection of 3 facilities
    const type = faker.helpers.arrayElement(hotelTypes)
    const description = faker.lorem.sentence()
    const pricePerNight = faker.commerce.price()
    const imageUrls = getNextImageUrls(3)

    hotels.push({
      userId: "66a073ba69200a3590d2102a",
      name,
      city,
      country,
      adultCount,
      childCount,
      facilities,
      type,
      imageUrls,
      description,
      pricePerNight,
      lastUpdated: new Date(),
      starRating,
    })
  }
  return hotels
}

// Insert sample data into MongoDB
const seedHotels = async () => {
  try {
    const numHotels = 50 // Number of hotels to insert
    const hotelData = generateHotelData(numHotels)
    await Hotel.insertMany(hotelData)
    console.log(`Inserted ${numHotels} hotels into the database.`)
  } catch (error) {
    console.error("Error seeding data:", error)
  } finally {
    mongoose.connection.close()
  }
}

seedHotels()

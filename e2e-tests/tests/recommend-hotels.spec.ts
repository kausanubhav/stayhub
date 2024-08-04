import { test, expect, Page } from "@playwright/test"
import path from "path"

const UI_URL = "http://localhost:5173"

type HotelType = {
  name: string
  city: string
  country: string
  description: string
  adultCount: number
  childCount: number
  starRating: number
  imageFiles?: string[]
  pricePerNight: number
  type: string
  facilities: string[]
}

export async function signIn(page: Page) {
  await page.goto(UI_URL)

  await page.getByRole("link", { name: "Sign In" }).click()

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible()
  await page.locator("[name=email]").fill("checkuser1@gmail.com")
  await page.locator("[name=password]").fill("checkuser1")

  await page.getByRole("button", { name: "Login" }).click()
  await expect(page.getByText("Sign in Successful!")).toBeVisible()
}

export async function addHotel(page: Page, hotel: HotelType) {
  console.log(hotel)
  const {
    name,
    city,
    country,
    description,

    starRating,
    type,
    facilities,
    pricePerNight,
  } = hotel
  await page.goto(`${UI_URL}/add-hotel`)
  await expect(page.getByText("Add hotel")).toBeVisible()

  await page.locator("[name=name]").fill(name)
  await page.locator("[name=city]").fill(city)
  await page.locator("[name=country]").fill(country)
  await page.locator("[name=description]").fill(description)
  await page.locator("[name=pricePerNight]").fill(pricePerNight.toString()) // Numeric price value
  await page.selectOption("select[name=starRating]", starRating.toString())
  await page.getByText(type).click() // Types
  await page.getByLabel(facilities[0]).check()
  await page.getByLabel(facilities[1]).check()
  await page.locator("[name=childCount]").nth(1).fill("1")
  await page.locator("[name=adultCount]").nth(1).fill("2")

  await page.setInputFiles("[name=imageFiles]", [
    path.join(__dirname, "files", "1.jpeg"),
    path.join(__dirname, "files", "2.jpg"),
  ])

  await page.getByRole("button", { name: "Save" }).click()
  await expect(page.getByText("Hotel saved")).toBeVisible()
}

//Recommendation process: Suggests hotels in a country or city which has been searched more often and has one or many features or has a type from the most popular types and facilities list.
// Most popular types and facilities are decided by the booked hotels.
//Collaborative recommendations can be added as well by adding like feature on hotels.

test.beforeEach(async ({ page }) => {
  await signIn(page)
})

test("should display hotels based on bookings and searches", async ({ page }) => {
  //66a3f0190496f376cff780f4
  const hotel: HotelType = {
    name: "Mortal",
    city: "Soul",
    country: "India",
    description: "This is description for Mortal in India",
    childCount: 1,
    adultCount: 2,
    pricePerNight: 500,
    starRating: 4,
    facilities: ["Room Service", "Pool"],
    type: "Motels",
  }

  //adding a hotel with the same country name and a facility an already booked hotel has
  //expecting it to be recommended
  await addHotel(page, hotel)

  //adding a search term; searching for 'India' or 'india' in serach bar
  await page.goto(UI_URL)
  await page.locator("[name=destination]").fill("India")

  //adding one search data which gets considered in the recommendation process
  await page.getByRole("button", { name: "Search" }).click()
  //await page.waitForNavigation() // Wait for navigation to complete
  // await page.waitForURL("**/search")

  await expect(page.getByText("Filter by:")).toBeVisible()
  await page.goto(UI_URL)

  await expect(page.getByText("Recommended for you")).toBeVisible()
  await expect(page.getByText("Mortal").nth(0)).toBeVisible()
})

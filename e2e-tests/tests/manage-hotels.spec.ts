import { test, expect } from "@playwright/test"
import path from "path"

const UI_URL = "http://localhost:5173"
const uniqueId = Date.now() // Unique identifier for this test run
const uniquePrice = 100 + (uniqueId % 1000) // Ensure price is numeric and unique

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL)

  await page.getByRole("link", { name: "Sign In" }).click()

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible()

  await page.locator("[name=email]").fill("checkuser1@gmail.com")
  await page.locator("[name=password]").fill("checkuser1")

  await page.getByRole("button", { name: "Login" }).click()

  await expect(page.getByText("Sign in Successful!")).toBeVisible()
})

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`)

  await page.locator('[name="name"]').fill(`Test Hotel ${uniqueId}`)
  await page.locator('[name="city"]').fill(`Test City ${uniqueId}`)
  await page.locator('[name="country"]').fill(`Test Country ${uniqueId}`)
  await page.locator('[name="description"]').fill(`Test Description ${uniqueId}`)
  await page.locator('[name="pricePerNight"]').fill(`${uniquePrice}`) // Numeric price value
  await page.selectOption('select[name="starRating"]', "3")
  await page.getByText("Airport").click() // Types
  await page.getByLabel("Pool").check()
  await page.getByLabel("Room Service").check()
  await page.locator('[name="adultCount"]').fill(`2`)
  await page.locator('[name="childCount"]').fill(`2`)

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.jpeg"),
    path.join(__dirname, "files", "2.jpg"),
  ])

  await page.getByRole("button", { name: "Save" }).click()
  await expect(page.getByText("Hotel saved")).toBeVisible()
})

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`)

  // Use locator to resolve multiple elements with the same text
  const hotelHeadingLocator = page.locator(`h2:has-text("Test Hotel ${uniqueId}")`)
  await expect(hotelHeadingLocator.first()).toBeVisible()

  await expect(page.getByText(`Test Description ${uniqueId}`)).toBeVisible()
  await expect(page.getByText(`Test City ${uniqueId}, Test Country ${uniqueId}`)).toBeVisible()

  // Use locator for fields with repeated text
  const airportTypeLocator = page.locator('text="Airport"')
  await expect(airportTypeLocator.first()).toBeVisible()

  await expect(page.getByText(`Rs.${uniquePrice} per night`)).toBeVisible()

  // Handle repeated text "2 adults, 2 children"
  const peopleInfoLocator = page.locator('text="2 adults, 2 children"')
  await expect(peopleInfoLocator.first()).toBeVisible()

  // Use locator to handle multiple instances of the links
  const viewDetailsLinkLocator = page.locator('role=link[name="View Details"]')
  await expect(viewDetailsLinkLocator.first()).toBeVisible()

  const addHotelLinkLocator = page.locator('role=link[name="Add Hotel"]')
  await expect(addHotelLinkLocator.first()).toBeVisible()
})

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`)

  const viewDetailsLinkLocator = page.locator('role=link[name="View Details"]')
  await viewDetailsLinkLocator.first().click()

  // await page.waitForSelector('[name="name"]',{state:"attached"})
  const nameField = page.locator('[name="name"]')
  await nameField.waitFor({ state: "attached" })

  await expect(nameField).toHaveValue(`Test Hotel ${uniqueId}`)

  await nameField.fill(`Test Hotel ${uniqueId} new`)

  await page.getByRole("button", { name: "Save" }).click()
  await expect(page.getByText("Hotel saved")).toBeVisible()
  
  await page.reload()

  await expect(nameField).toHaveValue(`Test Hotel ${uniqueId} new`)
  await nameField.fill(`Test Hotel ${uniqueId}`)
  await page.getByRole('button',{name:'Save'}).click()
})

import { test, expect } from "@playwright/test"

const UI_URL = "http://localhost:5173/"

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL)

  await page.getByRole("link", { name: "Sign In" }).click()

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible()

  await page.locator("[name=email]").fill("checkuser1@gmail.com")
  await page.locator("[name=password]").fill("checkuser1")

  await page.getByRole("button", { name: "Login" }).click()

  await expect(page.getByText("Sign in Successful!")).toBeVisible()
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible()
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible()
})

test("should allow user to register", async ({ page }) => {
  await page.goto(UI_URL)

  await page.getByRole("link", { name: "Sign In" }).click()

  await page.getByRole("link", { name: "Create an account here" }).click()
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible()

  await page.locator("[name=firstName]").fill("test_fistNname")
  await page.locator("[name=lastName]").fill("test_lastName")
  await page
    .locator("[name=email]")
    .fill(`test_register_${Math.floor(Math.random() * 9000) + 1000}@test.com`)
  await page.locator("[name=password]").fill("testPassword")
  await page.locator("[name=confirmPassword]").fill("testPassword")

  await page.getByRole("button", { name: "Create account" }).click()

  await expect(page.getByText("Registration Success!")).toBeVisible()
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible()
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible()
})

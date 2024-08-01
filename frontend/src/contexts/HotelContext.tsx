import { HotelType } from "@shared/types"
import { createContext, useContext, useState } from "react"

type HotelContextType = {
  hotels: HotelType[]
  setHotels: (data: HotelType[]) => void
}

const HotelContext = createContext<HotelContextType | undefined>(undefined)

export const HotelContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotels, setHotels] = useState<HotelType[]>([])

  return <HotelContext.Provider value={{ hotels, setHotels }}>{children}</HotelContext.Provider>
}

export const useHotelContext = () => {
  const context = useContext(HotelContext)
  if (context === undefined) throw new Error("useHotelContext must be used within a HotelProvider")
  return context
}

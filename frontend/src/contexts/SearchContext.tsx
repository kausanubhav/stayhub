import React, { createContext, useContext, useState } from "react"
export type SearchParamsType = {
  destination: string
  checkIn: Date
  checkOut: Date
  adultCount: number
  childCount: number
  hotelId?: string
}

type SearchContextType = {
  searchParams: SearchParamsType
  saveSearchValues: (params: SearchParamsType) => void
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined)

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useState<SearchParamsType>({
    destination: "",
    checkIn: new Date(),
    checkOut: new Date(),
    adultCount: 1,
    childCount: 1,
  })
  const saveSearchValues = (params: SearchParamsType) => {
    //preserves previous hotelId if not provided
    //although spread operator does the same without explicit handling the hotelId; hotelId has been written like this for code readability and clarity
    setSearchParams((prev) => ({ ...prev, ...params, hotelId: params.hotelId ?? prev.hotelId }))
  }
  return (
    <SearchContext.Provider value={{ searchParams, saveSearchValues }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearchContext must be used within an AppContextProvider")
  }
  return context as SearchContext
}

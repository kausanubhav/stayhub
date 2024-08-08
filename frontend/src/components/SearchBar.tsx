import { SearchParamsType, useSearchContext } from "@src/contexts/SearchContext"
import { FC, FormEvent, useEffect, useRef, useState } from "react"
import { MdTravelExplore } from "react-icons/md"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"

import * as apiClient from "../api-client"
import { useMutation, useQuery } from "react-query"

type SearchBarProps = {}

// Helper function for suggestions
const getFilteredSuggestions = (value: string, countries: string[], cities: string[]) => {
  const inputValue = value.toLowerCase()
  return [
    ...countries.filter((country) => country.toLowerCase().startsWith(inputValue)),
    ...cities.filter((city) => city.toLowerCase().startsWith(inputValue)),
  ]
}

// Custom Hook for sticky behavior
// const useSticky = (ref: React.RefObject<HTMLFormElement>) => {
//   const [isFixed, setIsFixed] = useState(false)
//   const originalOffsetTop = useRef<number>(0)

//   const handleScroll = () => {
//     if (ref.current) {
//       const scrollTop = window.scrollY || document.documentElement.scrollTop
//       setIsFixed(scrollTop >= originalOffsetTop.current)
//     }
//   }

//   useEffect(() => {
//     if (ref.current) {
//       originalOffsetTop.current = ref.current.offsetTop
//     }

//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [ref])

//   return isFixed
// }

// Custom Hook for outside click detection
const useOutsideClick = (refs: (React.RefObject<HTMLElement> | null)[], callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      const isOutside = refs.every((ref) => {
        if (ref?.current) {
          return !ref.current.contains(target)
        }
        return true //null ref means outside by default; noresultsref for ex
      })

      if (isOutside) {
        callback()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [refs, callback])
}

const SearchBar: FC<SearchBarProps> = () => {
  // Extract unique countries and cities from the fetched data
  const [countries, setCountries] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  // const [placeholderHeight, setPlaceholderHeight] = useState<number>(0)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const suggestionsRef = useRef<HTMLUListElement | null>(null)
  const noResultsRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick([inputRef, suggestionsRef, noResultsRef], () => setShowSuggestions(false))

  const { data: hotels } = useQuery("fetchQuery", apiClient.fetchHotels, {
    staleTime: Infinity,
  })
  const { mutate } = useMutation(apiClient.saveSearch, {
    onSuccess: (data) => {
      console.log("Search saved successfuly:", data)
    },
    onError: (error) => {
      console.error("Error saving search query:", error)
    },
  })
  useEffect(() => {
    if (hotels) {
      setCountries(Array.from(new Set(hotels.map((hotel) => hotel.country).filter(Boolean))))
      setCities(Array.from(new Set(hotels.map((hotel) => hotel.city).filter(Boolean))))
    }
  }, [hotels])

  const { searchParams, saveSearchValues } = useSearchContext()
  const [localSearchParams, setLocalSearchParams] = useState<SearchParamsType>(searchParams)
  const navigate = useNavigate()

  const searchBarRef = useRef<HTMLFormElement | null>(null)
  // const isFixed = useSticky(searchBarRef)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    saveSearchValues(localSearchParams)
    mutate(localSearchParams.destination)
    navigate("/search")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "destination") {
      setSuggestions(getFilteredSuggestions(value, countries, cities))
    }
  }
  const handleDateChange = (date: Date | null, name: "checkIn" | "checkOut") => {
    if (date) {
      setLocalSearchParams((prev) => ({
        ...prev,
        [name]: date,
      }))
    }
  }
  const handleSuggestionClick = (suggestion: string) => {
    setLocalSearchParams((prev) => ({
      ...prev,
      destination: suggestion,
    }))
    setShowSuggestions(false)
    //event.preventDefault()
  }

  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  const inputHeight = inputRef.current?.offsetHeight || 0
  const suggestionsTop = inputHeight + 8

  // useEffect(() => {
  //   if (searchBarRef.current) {
  //     setPlaceholderHeight(searchBarRef.current.offsetHeight)
  //   }
  // }, [searchBarRef.current])
  return (
    <>
      {/* Placeholder */}
      {/* <div style={{ height: isFixed ? placeholderHeight : "auto" }} /> */}
      <form
        ref={searchBarRef}
        className=" p-3  shadow-md rounded grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4 -mt-8 bg-orange-400 w-full"
        onSubmit={handleSubmit}
      >
        <div className="relative flex flex-row flex-1 bg-white items-center p-2">
          <MdTravelExplore size={25} className="mr-2" />
          <input
            ref={inputRef}
            placeholder="Where are you going?"
            className="w-full text-md focus:outline-none"
            type="text"
            name="destination"
            value={localSearchParams.destination}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
          />
          {showSuggestions &&
            suggestions.length > 0 &&
            localSearchParams.destination.length > 0 && (
              <ul
                ref={suggestionsRef}
                className={`z-50 absolute left-0 bg-orange-400 border border-gray-300 shadow-lg mt-1 max-h-60 overflow-auto w-full`}
                style={{ top: `${suggestionsTop}px` }}
              >
                {suggestions.map((suggestion, index: number) => (
                  <li
                    onClick={() => handleSuggestionClick(suggestion)}
                    key={index}
                    className="p-2 border-b bg-white hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          {showSuggestions &&
            suggestions.length === 0 &&
            localSearchParams.destination.length > 0 && (
              <div
                ref={noResultsRef}
                className="absolute left-0 bg-white border border-gray-300 shadow-lg mt-1 max-h-60 overflow-auto w-full"
                style={{ top: `${suggestionsTop}px` }}
              >
                <div className="p-2 font-semibold">No results</div>
              </div>
            )}
        </div>

        <div className="bg-white flex flex-1 px-2 py-1 gap-2">
          <label className="flex items-center">
            {" "}
            Adults:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={1}
              max={20}
              name="adultCount"
              value={localSearchParams.adultCount}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex items-center">
            {" "}
            Children:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={0}
              max={20}
              name="childCount"
              value={localSearchParams.childCount}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div>
          <DatePicker
            name="checkIn"
            selected={localSearchParams.checkIn}
            onChange={(date) => handleDateChange(date, "checkIn")}
            selectsStart
            startDate={localSearchParams.checkIn}
            endDate={localSearchParams.checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
          />
        </div>
        <div>
          <DatePicker
            name="checkOut"
            selected={localSearchParams.checkOut}
            onChange={(date) => handleDateChange(date, "checkOut")}
            selectsStart
            startDate={localSearchParams.checkIn}
            endDate={localSearchParams.checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-out Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
          />
        </div>

        <div className="flex gap-1">
          <button
            type="submit"
            className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500"
          >
            Search
          </button>
          <button className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
            Clear
          </button>
        </div>
      </form>{" "}
    </>
  )
}

export default SearchBar

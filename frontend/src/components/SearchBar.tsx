import { SearchParamsType, useSearchContext } from "@src/contexts/SearchContext"
import { FC, FormEvent, useState } from "react"
import { MdTravelExplore } from "react-icons/md"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"

type SearchBarProps = {}

const SearchBar: FC<SearchBarProps> = () => {
  const { searchParams, saveSearchValues } = useSearchContext()
  const [localSearchParams, setLocalSearchParams] = useState<SearchParamsType>(searchParams)
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    saveSearchValues(localSearchParams)
    navigate("/search")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleDateChange = (date: Date | undefined, name: "checkIn" | "checkOut") => {
    if (date) {
      setLocalSearchParams((prev) => ({
        ...prev,
        [name]: date,
      }))
    }
  }

  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  return (
    <form
      className="-mt-8 p-3 bg-orange-400 shadow-md rounded grid grid-cols-2 lg:grid-gols-3 2xl:grid-cols-5 items-center gap-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row flex-1 bg-white items-center p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="Where are you going?"
          className="w-full text-md focus:outline-none"
          type="text"
          name="destination"
          value={localSearchParams.destination}
          onChange={handleInputChange}
        />
      </div>

      <div className="bg-white flex flex-1 px-2 py-1 gap-2">
        <label className="flex items-center">
          {" "}
          Adults:
          <input
            type="text"
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
            type="text"
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
    </form>
  )
}

export default SearchBar

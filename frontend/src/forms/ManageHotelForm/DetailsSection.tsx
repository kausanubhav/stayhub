import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"

type DetailsSectionProps = {}

const DetailsSection: FC<DetailsSectionProps> = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>()
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add hotel</h1>
      <label className="flex-1 text-gray-700 text-sm font-bold ">
        Name
        <input
          className="border px-2 py-1 w-full rounded font-normal"
          type="text"
          {...register("name", { required: "This field is requierd." })}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </label>

      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            {...register("city", { required: "This field is required." })}
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.city && <span className="text-red-500">{errors.city.message}</span>}
        </label>
        <label className="flex-1 text-gray-700 text-sm font-bold">
          Country
          <input
            {...register("country", { required: "This field is required" })}
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.country && <span className="text-red-500">{errors.country.message}</span>}
        </label>
      </div>
      <label className="flex-1 text-gray-700 text-sm font-bold">
        Description
        <textarea
          rows={10}
          {...register("description", { required: "This field is required" })}
          className="border rounded w-full py-1 px-2 font-normal"
        />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      </label>
      <label className="max-w-[50%] text-gray-700 text-sm font-bold">
        Price Per Night
        <input
          {...register("pricePerNight", { required: "This field is required" })}
          type="number"
          min={1}
          className="border rounded w-full py-1 px-2 font-normal"
        />
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>
      <label className="max-w-[50%] text-gray-700 text-sm font-bold">
        Star Rating
        <select className="p-2 border w-full rounded font-normal text-gray-700" {...register('starRating',{required:'This field is required'})}>
          <option value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((number) => (
            <option value={number}>{number}</option>
          ))}
        </select>
        {errors.starRating && <span className="text-red-500">{errors.starRating.message}</span>}
      </label>
    </div>
  )
}

export default DetailsSection

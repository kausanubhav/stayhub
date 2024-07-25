import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"

type GuestsSectionProps = {}

const GuestsSection: FC<GuestsSectionProps> = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>()
  return (
    <div>
      {" "}
      <h2 className="text-2xl font-bold mb-3">Guests</h2>{" "}
      <div className="grid grid-cols-2 w-full border bg-gray-300 p-6 gap-4">
        <label className="text-sm font-semibold text-gray-700">
          Adults
          <input
            min={1}
            className="rounded bg-white w-full border py-2 px-3 font-normal"
            type="number"
            {...register("adultCount", { required: "This field is required" })}
          />
          <span></span>
          {errors.adultCount && (
            <span className="text-sm text-red-500 font-bold">{errors.adultCount?.message}</span>
          )}
        </label>
        <label className="text-sm font-semibold text-gray-700">
          Children
          <input
            min={0}
            className="rounded bg-white w-full border py-2 px-3 font-normal"
            type="number"
            {...register("childCount", { required: "This field is required" })}
          />
          {errors.childCount && (
            <span className="text-sm text-red-500 font-bold">{errors.childCount?.message}</span>
          )}
        </label>
      </div>
    </div>
  )
}

export default GuestsSection

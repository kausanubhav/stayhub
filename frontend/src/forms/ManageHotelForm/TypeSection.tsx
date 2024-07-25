import { useFormContext } from "react-hook-form"
import { hotelTypes } from "../../config/hotel-options-config"
import { HotelFormData } from "./ManageHotelForm"

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>()
  const typeWatch = watch("type")

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Type</h2>
      <div className="grid grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label
            className={
              typeWatch === type
                ? " cursor-pointer bg-blue-300 rounded-full md:text-md border py-2 px-5 flex font-semibold text-sm justify-center items-center hover:bg-blue-300"
                : "cursor-pointer bg-gray-300  text-sm md:text-md rounded-full border py-2 px-5 flex font-semibold  justify-center items-center hover:bg-blue-300"
            }
          >
            <input
              type="radio"
              className="hidden"
              value={type}
              {...register("type", { required: "This field is required" })}
            />
            <span className="tracking-tight">{type}</span>
          </label>
        ))}
      </div>
      {errors.type && <span className="text-red-500 text-sm font-bold">{errors.type.message}</span>}
    </div>
  )
}
export default TypeSection

import { FC } from "react"
import { HotelFormData } from "./ManageHotelForm"
import { useFormContext } from "react-hook-form"

type ImagesSectionProps = {}

const ImagesSection: FC<ImagesSectionProps> = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>()
  return (
    <div>
      <h2 className="text-2xl mb-3 font-bold">Images</h2>{" "}
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length

              if (totalLength === 0) return "At least one image should be added"
              if (totalLength > 6) return "Total number of images cannot be more than 6"
              return true
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span
          className="text-red-500 text-sm font-bold
      "
        >
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  )
}

export default ImagesSection

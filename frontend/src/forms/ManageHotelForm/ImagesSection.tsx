import { FC } from "react"
import { HotelFormData } from "./ManageHotelForm"
import { useFormContext } from "react-hook-form"

type ImagesSectionProps = {}

const ImagesSection: FC<ImagesSectionProps> = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>()
  const existingImageUrls = watch("imageUrls")

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault()
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    )
  }
  return (
    <div>
      <h2 className="text-2xl mb-3 font-bold">Images</h2>{" "}
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div
                key={url + new Date() + Math.floor(Math.random() * 1000)}
                className="relative group"
              >
                <img src={url} alt="" className="min-h-full object-cover" />
                <button
                  onClick={(e) => handleDelete(e, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 text-slate-300 group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length + (existingImageUrls?.length || 0)

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

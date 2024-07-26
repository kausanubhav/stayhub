import { useMutation, useQuery } from "react-query"
import { useParams } from "react-router-dom"
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm"
import { useAppContext } from "../contexts/AppContext"

const EditHotel = () => {
  const { hotelId } = useParams()
  const { showToast } = useAppContext()
  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ type: "SUCCESS", message: "Hotel saved" })
    },
    onError: () => {
      showToast({ type: "ERROR", message: "Error saving hotel" })
    },
  })
  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData)
  }
  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => apiClient.fetchMyHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  )
  return <ManageHotelForm hotel={hotel} isLoading={isLoading} onSave={handleSave} />
}
export default EditHotel

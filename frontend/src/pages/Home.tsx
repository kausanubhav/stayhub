import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import LatestDestinationCard from "@src/components/LatestDestinationCard"
import { HotelType } from "@src/types"
import { useAppContext } from "@src/contexts/AppContext"

const Home = () => {
  const { isLoggedIn } = useAppContext()
  const { data: hotels } = useQuery("fetchQuery", () => apiClient.fetchHotels())
  const { data: recommendedHotels } = useQuery(
    "fetchRecommnededHotels",
    apiClient.getRecommendedHotels
  )

  const topRowHotelsRecommended = recommendedHotels?.slice(0, 2) || []
  const bottomRowHotelsRecommended = recommendedHotels?.slice(2) || []

  const topRowHotels = hotels?.slice(0, 2) || []
  const bottomRowHotels = hotels?.slice(2) || []
  return (
    <div className="space-y-3">
      {isLoggedIn && recommendedHotels?.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mt-4">Recommended for you</h2>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              {topRowHotelsRecommended.map((hotel: HotelType) => (
                <LatestDestinationCard hotel={hotel} key={hotel._id} />
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {bottomRowHotelsRecommended.map((hotel: HotelType) => (
                <LatestDestinationCard hotel={hotel} key={hotel._id} />
              ))}
            </div>
          </div>{" "}
        </>
      )}
      <h2 className="text-3xl font-bold mt-4">Latest Destinations</h2>
      <p>Most recent destinations added by our hosts</p>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {topRowHotels.map((hotel: HotelType) => (
            <LatestDestinationCard hotel={hotel} key={hotel._id} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {bottomRowHotels.map((hotel: HotelType) => (
            <LatestDestinationCard hotel={hotel} key={hotel._id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

import { HotelType } from "@src/types"
import { Link } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"


type Props = {
  hotel: HotelType
}

const LatestDestinationCard = ({ hotel }: Props) => {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
      <div className="h-[300px]">
        <LazyLoadImage
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-3xl">{hotel.name}</span>
      </div>
    </Link>
  )
}

export default LatestDestinationCard

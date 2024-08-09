import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router-dom"
import * as apiClient from "./../api-client"
import { AiFillStar } from "react-icons/ai"
import { LazyLoadImage } from "react-lazy-load-image-component"

import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm"
import { useRef, useState } from "react"
import { useAppContext } from "@src/contexts/AppContext"

export type ReviewType = {
  _id: string
  date: string
  data: string
  name: string
}

const Detail = () => {
  const { isLoggedIn, showToast } = useAppContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const reviewRef = useRef<HTMLTextAreaElement | null>(null)

  const queryClient = useQueryClient()

  const openModal = (image: string) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage("")
  }

  const { hotelId } = useParams()

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  )

  const { data: reviews, error: reviewsError } = useQuery<ReviewType[]>(
    "fetchReviewByHotelId",
    () => apiClient.getUserReviews(hotelId as string),
    {
      enabled: !!hotelId,
    }
  )

  if (reviewsError) {
    // Handle or display the error
    console.error(reviewsError)
   // return <div>Error loading reviews.</div>
  }
  const { mutate } = useMutation(
    ({ hotelId, review }: { hotelId: string; review: string }) =>
      apiClient.addUserReview(hotelId, review),
    {
      onSuccess: () => {
        if (reviewRef.current) {
          reviewRef.current.value = "" // Clear review input on success
        }
        showToast({ message: "Review added!", type: "SUCCESS" })
        queryClient.invalidateQueries("fetchReviewByHotelId")
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "SUCCESS" })
      },
    }
  )

  const handleOverlayClick = () => {
    // Close modal when clicking on the overlay
    closeModal()
  }

  const handleModalClick = (event: React.MouseEvent) => {
    // Prevent closing the modal when clicking inside the modal content
    event.stopPropagation()
  }

  const handleReviewSubmit = () => {
    const reviewText = reviewRef.current?.value.trim() || ""
    if (reviewText === "") return // Prevent empty reviews

    mutate({ hotelId: hotelId as string, review: reviewText })
  }

  if (!hotel) {
    return <></>
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar key={index} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <h2 className="text-md font-semibold mt-1">
          {hotel.city}, {hotel.country}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image) => (
          <div key={image + new Date()} className="h-[300px]">
            <LazyLoadImage
              onClick={() => openModal(image)}
              src={image}
              alt={hotel.name}
              className=" cursor-pointer rounded-md w-full h-full object-cover object-center hover:scale-105 transition-all"
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleOverlayClick} // Close modal on overlay click
        >
          <div
            onClick={handleModalClick} // Prevent close on modal content click
            className="relative"
          >
            <button className="absolute top-2 right-2 text-white text-2xl" onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Detailed view"
              className=" rounded max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div key={facility + new Date()} className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id} />
        </div>
      </div>

      {isLoggedIn && (
        <div>
          {/* User reviews */}
          <div className="mt-6">
            <h2 className="text-3xl font-bold mt-4 mb-2">Reviews</h2>
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-2">
                    Posted by: {review.name} on {new Date(review.date).toLocaleDateString()}
                  </div>
                  <p className="text-gray-700">{review.data}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          <label>
            <h2 className="text-3xl font-bold mt-4">Add a review</h2>
            <textarea
              ref={reviewRef}
              className=" mt-2 border rounded w-full py-1 px-2 font-normal"
            ></textarea>
            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white font-bold p-2 hover:bg-blue-500 text-xl disabled:bg-gray-500"
                onClick={handleReviewSubmit}
              >
                Add review
              </button>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}

export default Detail

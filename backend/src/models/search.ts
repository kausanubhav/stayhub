// To store the search history 
import mongoose from "mongoose"

type SearchType = {
  userId: string
  query: string
  timestamp?: Date
}

const SearchSchema = new mongoose.Schema<SearchType>(
  {
    userId: { type: String, required: true },
    query: { type: String, required: true },
  },
  { timestamps: true }
)


export const Search=mongoose.model('Search',SearchSchema)

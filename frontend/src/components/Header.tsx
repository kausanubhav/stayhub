import { FC } from "react"
import { Link } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"
import SignOutButton from "./SignOutButton"

type HeaderProps = {}

const Header: FC<HeaderProps> = () => {
  const { isLoggedIn, showToast } = useAppContext()
  return (
    <div className="bg-blue-800 py-6">
      <div className="  container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">StayHub</Link>
        </span>
        <span className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                onClick={() => {
                  showToast({ message: "Development in process...", type: "ERROR" })
                }}
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              {" "}
              <Link
                to="/sign-in"
                className=" bg-white  flex items-center font-bold text-xl text-blue-600 px-3 hover:bg-gray-100"
              >
                Sign In
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  )
}

export default Header

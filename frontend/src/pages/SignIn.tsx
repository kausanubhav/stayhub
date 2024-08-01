import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"

import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext"
import { Link, useLocation, useNavigate } from "react-router-dom"

export type SignInFormData = {
  email: string
  password: string
}

const SignIn = () => {
  const queryClient = useQueryClient()
  const { showToast } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>()

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ type: "SUCCESS", message: "Sign in Successful!" })
      await queryClient.invalidateQueries("validateToken")
      navigate(location.state?.from?.pathname || "/")
    },
    onError: async (error: Error) => {
      showToast({ type: "ERROR", message: error.message })
      navigate("/sign-in")
    },
  })

  //handleSubmit is used to validate the form data and
  //to preventing the default browser reload behavior
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold ">Sign in</h2>
      <label className="flex-1 text-gray-700 text-sm font-bold">
        Email
        <input
          {...register("email", { required: "This field is required" })}
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </label>
      <label className="flex-1 text-gray-700 text-sm font-bold">
        Password
        <input
          {...register("password", {
            required: "This field is required",
            minLength: { value: 6, message: "Password must be of atleast 6 characters." },
          })}
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not registered?{" "}
          <Link className="underline" to="/register">
            Create an account here
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Login
        </button>
      </span>
    </form>
  )
}

export default SignIn

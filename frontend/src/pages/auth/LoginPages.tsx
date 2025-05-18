import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import api from "../../services/apiHandler"
import type { IApiErrorResponse } from "@/types/apiHandler"
import { CONFIG_FIELD } from "@configs/field.configs"

/**
 * LoginPage Component – User authentication page.
 *
 * This component handles:
 * - Form validation using `react-hook-form` and `zod`
 * - Sending login credentials to the API for authentication
 * - Securely storing access and refresh tokens in cookies
 * - Displaying success and error feedback via `react-toastify`
 * - Field-specific error display and focus using form error handling
 * - "Remember me" functionality to extend session duration
 * - Toggle password visibility (show/hide)
 *
 * Dependencies:
 * - react-hook-form with zod for form validation
 * - react-toastify for user notifications
 * - react-router-dom for client-side navigation
 */

// Zod validation schema
const loginSchema = z.object({
	email: z.string().email("Invalid email").min(1, "Email is required"),
	password: z.string().min(CONFIG_FIELD.LENGTH.PASSWORD.MIN, "Password is required"),
	rememberMe: z.boolean().optional(),
})

// Type inferred from schema
type LoginFormValues = z.infer<typeof loginSchema>

// Cookie utilities
const setCookie = (name: string, value: string, maxAgeInSeconds: number) => {
	document.cookie = `${name}=${value}; path=/; max-age=${maxAgeInSeconds}; SameSite=Strict`
}

const LoginPage: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	// React Hook Form configuration with Zod
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	})

	const onSubmit = async (data: LoginFormValues) => {
		setLoading(true)

		try {
			const response = await api.login(data.email, data.password)

			if (response.success === true) {
				if (response.data && "tokens" in response.data) {
					// Extract tokens from the API response
					const { accessToken, refreshToken } = response.data.tokens

					// Define cookie expiration times
					const accessTokenMaxAge = data.rememberMe ? 900 : 900 // 15 minutes
					const refreshTokenMaxAge = data.rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60 // 7 days or 1 day

					// Store tokens in cookies
					setCookie("token", accessToken, accessTokenMaxAge)
					setCookie("refreshToken", refreshToken, refreshTokenMaxAge)

					toast.success("Login successful")
					navigate("/")
				} else {
					toast.error("Invalid response format")
				}
			} else {
				const errorResponse = response as IApiErrorResponse

				// Display a general error message if no field-specific errors are returned
				if (!errorResponse.error?.errors || errorResponse.error.errors.length === 0) {
					toast.error(errorResponse.error?.message || "Invalid credentials")
					return
				}

				// Display specific field errors
				errorResponse.error.errors.forEach((fieldError) => {
					if (fieldError.field && fieldError.message) {
						// Set the error on the corresponding field
						setError(
							fieldError.field as "email" | "password",
							{ message: fieldError.message },
							{ shouldFocus: true }
						)
					}
				})
			}
		} catch (error) {
			console.error("Login error:", error)
			toast.error("Server connection error")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex justify-center items-center min-h-[80vh] px-4'>
			<div className='bg-white rounded-lg shadow-fr-md w-full max-w-md p-8'>
				<h1 className='text-2xl font-bold text-center text-fr-blue mb-8'>Connexion</h1>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='mb-6'>
						<label className='block text-gray-700 mb-2' htmlFor='email'>
							Email
						</label>
						<input
							id='email'
							type='email'
							placeholder='example@email.com'
							className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
								errors.email ? "ring-2 ring-fr-red" : ""
							}`}
							{...register("email")}
						/>
						{errors.email && (
							<p className='text-fr-red text-sm mt-1'>
								{errors.email.message}
							</p>
						)}
					</div>

					<div className='mb-6'>
						<label className='block text-gray-700 mb-2' htmlFor='password'>
							Mot de passe
						</label>
						<div className='relative'>
							<input
								id='password'
								type={showPassword ? "text" : "password"}
								placeholder='Votre mot de passe'
								className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
									errors.password
										? "ring-2 ring-fr-red border-fr-red"
										: ""
								}`}
								{...register("password")}
							/>
							<button
								type='button'
								className='absolute right-3 top-1/2 transform -translate-y-1/2 text-fr-blue'
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
										/>
									</svg>
								) : (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
										/>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
										/>
									</svg>
								)}
							</button>
						</div>
						{errors.password && (
							<p className='text-fr-red text-sm mt-1'>
								{errors.password.message}
							</p>
						)}
					</div>

					<div className='flex justify-between items-center mb-6'>
						<div className='flex items-center space-x-2'>
							<input
								type='checkbox'
								id='rememberMe'
								className='form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500'
								{...register("rememberMe")}
							/>
							<label htmlFor='rememberMe' className='text-gray-700'>
								Se souvenir de moi
							</label>
						</div>
						<Link
							to='/mot-de-passe-oublie'
							className='text-indigo-600 hover:underline'
						>
							Mot de passe oublié?
						</Link>
					</div>

					<button
						type='submit'
						className='w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						disabled={loading}
					>
						{loading ? "Connexion dans..." : "Connexion"}
					</button>

					<div className='text-center mt-6'>
						<p className='text-gray-700'>
							Vous n'avez pas de compte?{" "}
							<Link
								to='/register'
								className='text-indigo-600 hover:underline'
							>
								Créer un compte
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default LoginPage

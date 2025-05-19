import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { CONFIG_FIELD } from "@configs/field.configs"
import useAuthStore from "@/store/authStore"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import React, { useState } from "react"
import { z } from "zod"

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

const LoginPage: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false)
	const navigate = useNavigate()

	const { login, isLoading } = useAuthStore()

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
		try {
			// Use the login function from the store
			const success = await login(data.email, data.password, data.rememberMe || false)

			if (success) {
				toast.success("Connexion réussie")
				navigate("/")
			} else {
				// In case of failure, display a general error message
				toast.error("Identifiants incorrects ou compte inexistant")
			}
		} catch (error) {
			console.error("Login error:", error)
			toast.error("Erreur de connexion au serveur")

			// You can also set field-specific errors if you have more information
			setError("email", { message: "Veuillez vérifier vos identifiants" }, { shouldFocus: true })
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
							<div className='relative flex items-center'>
								<input
									type='checkbox'
									id='rememberMe'
									className='peer w-5 h-5 appearance-none rounded border border-gray-300 bg-white checked:bg-white focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue'
									{...register("rememberMe")}
								/>
								{/* Custom validation symbol that appears when the checkbox is checked */}
								<svg
									className='absolute left-0.5 top-0.5 w-4 h-4 text-fr-blue pointer-events-none opacity-0 peer-checked:opacity-100'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									strokeWidth={2}
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M5 13l4 4L19 7'
									/>
								</svg>
							</div>
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
						disabled={isLoading}
					>
						{isLoading ? "Connexion en cours..." : "Connexion"}
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

// src/pages/RegisterPage.tsx
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import useStore from "@/stores/useStore"
import { useForm } from "react-hook-form"
import React, { useState } from "react"
import { toast } from "react-toastify"
import api from "@/services/apiHandler"
import { z } from "zod"

// Validation schema
const registerSchema = z.object({
	email: z.string().email("Email invalide").min(1, "Email requis"),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
		.regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
		.regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
		.regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
	name: z.string().min(1, "Nom requis"),
	firstName: z.string().min(1, "Prénom requis"),
	birthDate: z
		.string()
		.min(1, "Date de naissance requise")
		.refine((date) => !isNaN(Date.parse(date)), {
			message: "Date de naissance invalide",
		}),
	terms: z.boolean().refine((val) => val === true, {
		message: "Vous devez accepter les conditions générales",
	}),
})

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterPage: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	// Utiliser le store centralisé
	const { auth } = useStore()
	const { login } = auth

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
			firstName: "",
			birthDate: "",
			terms: false,
		},
	})

	const onSubmit = async (data: RegisterFormValues) => {
		setIsLoading(true)

		try {
			// Créer l'objet userData pour l'inscription avec le role inclus
			const userData = {
				email: data.email,
				password: data.password,
				name: data.name,
				firstName: data.firstName,
				birthDate: data.birthDate,
				role: "user" as const, // Inclure explicitement le rôle
			}

			// Appeler directement l'API d'inscription
			const response = await api.register(userData)

			if (response.success && response.data) {
				toast.success("Compte créé avec succès !")

				// Connecter automatiquement l'utilisateur après l'inscription
				const loginSuccess = await login(data.email, data.password)

				if (loginSuccess) {
					navigate("/")
				} else {
					// Si la connexion automatique échoue, rediriger vers la page de connexion
					navigate("/login")
				}
			} else {
				// Gérer les erreurs de validation côté serveur
				if (!response.success) {
					// Vérifier s'il y a des erreurs de validation spécifiques aux champs
					if (response.error?.errors && response.error.errors.length > 0) {
						// Afficher les erreurs sur les champs correspondants
						response.error.errors.forEach((fieldError) => {
							if (fieldError.field) {
								const fieldName =
									fieldError.field as keyof RegisterFormValues

								// Mapper les champs du backend vers les champs du formulaire
								if (
									[
										"email",
										"password",
										"name",
										"firstName",
										"birthDate",
									].includes(fieldName)
								) {
									setError(
										fieldName,
										{
											message: fieldError.message,
										},
										{ shouldFocus: true }
									)
								} else if (fieldError.field === "role") {
									// Pour les erreurs de rôle, afficher un toast car ce n'est pas un champ visible
									toast.error(
										"Erreur de configuration du compte. Veuillez réessayer."
									)
								}
							}
						})
					} else {
						// Afficher le message d'erreur général
						toast.error(
							response.error?.message ||
								"Erreur lors de la création du compte"
						)
					}
				}
			}
		} catch (error) {
			console.error("Registration error:", error)
			toast.error("Erreur de connexion au serveur")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='flex justify-center items-center min-h-[80vh] px-4'>
			<div className='bg-white rounded-lg shadow-fr-md w-full max-w-lg p-8'>
				<h1 className='text-2xl font-bold text-center text-fr-blue mb-8'>Créer un compte</h1>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div>
						<label className='block text-gray-700 mb-2' htmlFor='email'>
							Email *
						</label>
						<input
							id='email'
							type='email'
							placeholder='exemple@email.com'
							autoComplete='username'
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

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-gray-700 mb-2' htmlFor='name'>
								Nom *
							</label>
							<input
								id='name'
								type='text'
								placeholder='Nom'
								autoComplete='family-name'
								className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
									errors.name ? "ring-2 ring-fr-red" : ""
								}`}
								{...register("name")}
							/>
							{errors.name && (
								<p className='text-fr-red text-sm mt-1'>
									{errors.name.message}
								</p>
							)}
						</div>

						<div>
							<label className='block text-gray-700 mb-2' htmlFor='firstName'>
								Prénom *
							</label>
							<input
								id='firstName'
								type='text'
								placeholder='Prénom'
								autoComplete='given-name'
								className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
									errors.firstName ? "ring-2 ring-fr-red" : ""
								}`}
								{...register("firstName")}
							/>
							{errors.firstName && (
								<p className='text-fr-red text-sm mt-1'>
									{errors.firstName.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<label className='block text-gray-700 mb-2' htmlFor='birthDate'>
							Date de naissance *
						</label>
						<input
							id='birthDate'
							type='date'
							autoComplete='bday'
							className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
								errors.birthDate ? "ring-2 ring-fr-red" : ""
							}`}
							{...register("birthDate")}
						/>
						{errors.birthDate && (
							<p className='text-fr-red text-sm mt-1'>
								{errors.birthDate.message}
							</p>
						)}
					</div>

					<div>
						<label className='block text-gray-700 mb-2' htmlFor='password'>
							Mot de passe *
						</label>
						<div className='relative'>
							<input
								id='password'
								type={showPassword ? "text" : "password"}
								placeholder='Mot de passe'
								autoComplete='new-password'
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
						<p className='text-gray-500 text-sm mt-2'>
							Le mot de passe doit contenir au moins 8 caractères, une
							majuscule, un chiffre et un caractère spécial.
						</p>
					</div>

					<div className='flex items-center space-x-2'>
						<div className='relative flex items-center'>
							<input
								type='checkbox'
								id='terms'
								className='peer w-5 h-5 appearance-none rounded border border-gray-300 bg-white checked:bg-white focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue'
								{...register("terms")}
							/>
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
						<label htmlFor='terms' className='text-gray-700'>
							J'accepte les{" "}
							<Link
								to='/conditions-generales'
								className='text-fr-blue hover:underline'
							>
								conditions générales
							</Link>
						</label>
					</div>
					{errors.terms && <p className='text-fr-red text-sm'>{errors.terms.message}</p>}

					<button
						type='submit'
						className='w-full bg-fr-blue text-white py-3 rounded-md font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fr-blue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<span className='inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
								Création en cours...
							</>
						) : (
							"Créer mon compte"
						)}
					</button>

					<div className='text-center mt-4'>
						<p className='text-gray-700'>
							Vous avez déjà un compte?{" "}
							<Link to='/login' className='text-fr-blue hover:underline'>
								Connexion
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default RegisterPage

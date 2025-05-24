import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { IUser } from '@/factories/Factory'
import type { UserFormData } from '@/pages/admin/tabs/UsersTab'

interface UserFormProps {
	initialData?: IUser
	onSubmit: (userData: UserFormData) => Promise<boolean>
	onCancel?: () => void
	isLoading?: boolean
	mode?: 'create' | 'edit'
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel, isLoading = false, mode = 'create' }) => {
	// Adaptive schema based on mode
	const userSchema = z.object({
		email: z.string().email('Email invalide'),
		name: z.string().min(1, 'Nom requis'),
		firstName: z.string().min(1, 'Prénom requis'),
		birthDate: z.string().min(1, 'Date de naissance requise'),
		role: z.enum(['user', 'administrator'], {
			errorMap: () => ({ message: 'Rôle invalide' }),
		}),
		password:
			mode === 'create'
				? z.string().min(8, 'Mot de passe minimum 8 caractères')
				: z.string().min(8, 'Mot de passe minimum 8 caractères').optional().or(z.literal('')),
	})

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			email: initialData?.email || '',
			name: initialData?.name || '',
			firstName: initialData?.firstName || '',
			birthDate: initialData?.birthDate
				? new Date(initialData.birthDate).toISOString().split('T')[0]
				: '',
			role: initialData?.role || 'user',
			password: '',
		},
	})

	const onFormSubmit = async (data: UserFormData) => {
		// In edit mode, only send password if it's provided
		if (mode === 'edit' && (!data.password || data.password === '')) {
			delete data.password
		}

		const success = await onSubmit(data)
		if (success && mode === 'create') {
			reset()
		}
	}

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
			{/* Email */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-gray-700 mb-2' htmlFor='email'>
						Email
					</label>
					<input
						id='email'
						type='email'
						placeholder='utilisateur@exemple.com'
						className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
							errors.email ? 'ring-2 ring-fr-red border-fr-red' : ''
						}`}
						{...register('email')}
					/>
					{errors.email && (
						<p className='text-fr-red text-sm mt-1'>{errors.email.message}</p>
					)}
				</div>

				{/* Rôle */}
				<div>
					<label className='block text-gray-700 mb-2' htmlFor='role'>
						Rôle
					</label>
					<select
						id='role'
						className={`w-full px-4 py-3 rounded-md bg-gray-50 text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
							errors.role ? 'ring-2 ring-fr-red border-fr-red' : ''
						}`}
						{...register('role')}
					>
						<option value='user'>Utilisateur</option>
						<option value='administrator'>Administrateur</option>
					</select>
					{errors.role && (
						<p className='text-fr-red text-sm mt-1'>{errors.role.message}</p>
					)}
				</div>
			</div>

			{/* Name and FirstName */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-gray-700 mb-2' htmlFor='name'>
						Nom
					</label>
					<input
						id='name'
						type='text'
						placeholder='Nom de famille'
						className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
							errors.name ? 'ring-2 ring-fr-red border-fr-red' : ''
						}`}
						{...register('name')}
					/>
					{errors.name && (
						<p className='text-fr-red text-sm mt-1'>{errors.name.message}</p>
					)}
				</div>

				<div>
					<label className='block text-gray-700 mb-2' htmlFor='firstName'>
						Prénom
					</label>
					<input
						id='firstName'
						type='text'
						placeholder='Prénom'
						className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
							errors.firstName ? 'ring-2 ring-fr-red border-fr-red' : ''
						}`}
						{...register('firstName')}
					/>
					{errors.firstName && (
						<p className='text-fr-red text-sm mt-1'>{errors.firstName.message}</p>
					)}
				</div>
			</div>

			{/* BirthDate */}
			<div>
				<label className='block text-gray-700 mb-2' htmlFor='birthDate'>
					Date de naissance
				</label>
				<input
					id='birthDate'
					type='date'
					className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
						errors.birthDate ? 'ring-2 ring-fr-red border-fr-red' : ''
					}`}
					{...register('birthDate')}
				/>
				{errors.birthDate && (
					<p className='text-fr-red text-sm mt-1'>{errors.birthDate.message}</p>
				)}
			</div>

			{/* Password */}
			<div>
				<label className='block text-gray-700 mb-2' htmlFor='password'>
					{mode === 'create' ? 'Mot de passe' : 'Nouveau mot de passe (optionnel)'}
				</label>
				<input
					id='password'
					type='password'
					placeholder={
						mode === 'create'
							? 'Minimum 8 caractères'
							: 'Laisser vide pour ne pas changer'
					}
					className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
						errors.password ? 'ring-2 ring-fr-red border-fr-red' : ''
					}`}
					{...register('password')}
				/>
				{errors.password && (
					<p className='text-fr-red text-sm mt-1'>{errors.password.message}</p>
				)}
			</div>

			{/* Boutons d'action */}
			<div className='flex justify-end gap-4 pt-4'>
				<button
					type='button'
					onClick={onCancel}
					className='px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
					disabled={isLoading || isSubmitting}
				>
					Annuler
				</button>
				<button
					type='submit'
					className='px-6 py-3 bg-fr-blue text-white rounded-md font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fr-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center'
					disabled={isLoading || isSubmitting}
				>
					{isSubmitting ? (
						<>
							<span className='inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
							En cours...
						</>
					) : mode === 'create' ? (
						'Créer'
					) : (
						'Mettre à jour'
					)}
				</button>
			</div>
		</form>
	)
}

export default UserForm

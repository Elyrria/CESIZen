import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { IInformation, ICategory } from '@/factories/Factory'

// Zod validation schema
const informationSchema = z.object({
	title: z.string().min(1, 'Titre requis').max(200, 'Titre trop long'),
	descriptionInformation: z.string().min(1, 'Description requise'),
	name: z.string().min(1, 'Nom requis'),
	type: z.enum(['TEXT', 'IMAGE', 'VIDEO']),
	content: z.string().optional(),
	categoryId: z.array(z.string()).min(1, 'Au moins une catégorie requise'),
	file: z.instanceof(File).optional(),
})

type InformationFormData = z.infer<typeof informationSchema>

interface InformationFormProps {
	initialData?: IInformation
	onSubmit: (formData: FormData) => Promise<boolean>
	categories: ICategory[]
	isLoading?: boolean
	mode?: 'create' | 'edit'
}

const InformationForm: React.FC<InformationFormProps> = ({
	initialData,
	onSubmit,
	categories,
	isLoading = false,
	mode = 'create',
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
	} = useForm<InformationFormData>({
		resolver: zodResolver(informationSchema),
		defaultValues: {
			title: initialData?.title || '',
			descriptionInformation: initialData?.descriptionInformation || '',
			name: initialData?.name || '',
			type: initialData?.type || 'TEXT',
			content: initialData?.content || '',
			categoryId: Array.isArray(initialData?.categoryId)
				? initialData.categoryId.map((cat) =>
						typeof cat === 'string' ? cat : (cat as { id: string }).id
				  )
				: initialData?.categoryId
				? [
						typeof initialData.categoryId === 'string'
							? initialData.categoryId
							: (initialData.categoryId as { id: string }).id,
				  ]
				: [],
		},
	})

	const watchedType = watch('type')

	// Handle file change
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setSelectedFile(file)

			// Create a preview for images
			if (file.type.startsWith('image/')) {
				const url = URL.createObjectURL(file)
				setPreviewUrl(url)
			} else {
				setPreviewUrl(null)
			}
		}
	}

	// Clean up the preview URL
	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
			}
		}
	}, [previewUrl])

	const onFormSubmit = async (data: InformationFormData) => {
		const formData = new FormData()

		// Add form data
		formData.append('title', data.title)
		formData.append('descriptionInformation', data.descriptionInformation)
		formData.append('name', data.name)
		formData.append('type', data.type)

		if (data.content) {
			formData.append('content', data.content)
		}

		// Add categories
		data.categoryId.forEach((catId) => {
			formData.append('categoryId', catId)
		})

		// Add file if present
		if (selectedFile) {
			formData.append('file', selectedFile)
		}

		await onSubmit(formData)
	}

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
			{/* Title */}
			<div>
				<label className='block text-gray-700 mb-2' htmlFor='title'>
					Titre *
				</label>
				<input
					{...register('title')}
					id='title'
					type='text'
					placeholder="Titre de l'information"
					className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
						errors.title ? 'ring-2 ring-fr-red border-fr-red' : ''
					}`}
				/>
				{errors.title && <p className='text-fr-red text-sm mt-1'>{errors.title.message}</p>}
			</div>

			{/* Name */}
			<div>
				<label className='block text-gray-700 mb-2' htmlFor='name'>
					Nom *
				</label>
				<input
					{...register('name')}
					id='name'
					type='text'
					placeholder="Nom de l'information"
					className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
						errors.name ? 'ring-2 ring-fr-red border-fr-red' : ''
					}`}
				/>
				{errors.name && <p className='text-fr-red text-sm mt-1'>{errors.name.message}</p>}
			</div>

			{/* Type */}
			<div>
				<label className='block text-gray-700 mb-2' htmlFor='type'>
					Type de contenu *
				</label>
				<select
					{...register('type')}
					id='type'
					className={`w-full px-4 py-3 rounded-md bg-gray-50 text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
						errors.type ? 'ring-2 ring-fr-red border-fr-red' : ''
					}`}
				>
					<option value='TEXT'>Contenu textuel</option>
					<option value='IMAGE'>Image</option>
					<option value='VIDEO'>Vidéo</option>
				</select>
				{errors.type && <p className='text-fr-red text-sm mt-1'>{errors.type.message}</p>}
			</div>

			{/* Description */}
			<div>
				<label className='block text-gray-700 mb-2' htmlFor='descriptionInformation'>
					Description *
				</label>
				<textarea
					{...register('descriptionInformation')}
					id='descriptionInformation'
					rows={4}
					placeholder="Description détaillée de l'information"
					className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue resize-vertical ${
						errors.descriptionInformation ? 'ring-2 ring-fr-red border-fr-red' : ''
					}`}
				/>
				{errors.descriptionInformation && (
					<p className='text-fr-red text-sm mt-1'>
						{errors.descriptionInformation.message}
					</p>
				)}
			</div>

			{/* Text content (only for type TEXT) */}
			{watchedType === 'TEXT' && (
				<div>
					<label className='block text-gray-700 mb-2' htmlFor='content'>
						Contenu
					</label>
					<textarea
						{...register('content')}
						id='content'
						rows={8}
						placeholder="Contenu détaillé de l'information"
						className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue resize-vertical ${
							errors.content ? 'ring-2 ring-fr-red border-fr-red' : ''
						}`}
					/>
					{errors.content && (
						<p className='text-fr-red text-sm mt-1'>{errors.content.message}</p>
					)}
				</div>
			)}

			{/* Categories */}
			<div>
				<label className='block text-gray-700 mb-2'>Catégories *</label>
				<div className='space-y-2 max-h-40 overflow-y-auto bg-gray-50 border border-gray-300 rounded-md p-4'>
					{categories.map((category) => (
						<label
							key={category.id}
							className='flex items-center hover:bg-gray-100 p-2 rounded cursor-pointer'
						>
							<div className='relative flex items-center mr-3'>
								<input
									{...register('categoryId')}
									type='checkbox'
									value={category.id}
									className='peer w-5 h-5 appearance-none rounded border border-gray-300 bg-white checked:bg-white focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue'
								/>
								{/* Custom checkmark identique à LoginPages */}
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
							<span className='text-gray-700 select-none'>
								{category.name}
							</span>
						</label>
					))}
				</div>
				{errors.categoryId && (
					<p className='text-fr-red text-sm mt-1'>{errors.categoryId.message}</p>
				)}
			</div>

			{/* File upload (for IMAGE and VIDEO) */}
			{(watchedType === 'IMAGE' || watchedType === 'VIDEO') && (
				<div>
					<label className='block text-gray-700 mb-2' htmlFor='file'>
						{watchedType === 'IMAGE' ? 'Image' : 'Vidéo'} *
					</label>
					<input
						type='file'
						id='file'
						accept={watchedType === 'IMAGE' ? 'image/*' : 'video/*'}
						onChange={handleFileChange}
						className='w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-fr-blue file:text-white hover:file:bg-blue-800'
					/>

					{/* Preview for images */}
					{previewUrl && watchedType === 'IMAGE' && (
						<div className='mt-3'>
							<img
								src={previewUrl}
								alt='Preview'
								className='max-w-xs max-h-48 object-cover rounded-md border border-gray-300 shadow-sm'
							/>
						</div>
					)}

					{/* Selected file info */}
					{selectedFile && (
						<div className='mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border'>
							Fichier sélectionné:{' '}
							<span className='font-medium'>{selectedFile.name}</span>
							<span className='text-gray-500 ml-2'>
								({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
							</span>
						</div>
					)}
				</div>
			)}

			{/* Buttons */}
			<div className='flex justify-end gap-3 pt-6 border-t border-gray-200'>
				<button
					type='button'
					onClick={() => reset()}
					className='px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
					disabled={isLoading}
				>
					Réinitialiser
				</button>
				<button
					type='submit'
					className='px-6 py-3 bg-fr-blue text-white rounded-md font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fr-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center'
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<span className='inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
							Enregistrement...
						</>
					) : mode === 'create' ? (
						'Créer'
					) : (
						'Modifier'
					)}
				</button>
			</div>
		</form>
	)
}

export default InformationForm

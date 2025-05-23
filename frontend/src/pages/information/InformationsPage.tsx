import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useInformationStore from '@/stores/useInformationStore'
import useCategoryStore from '@/stores/useCategoryStore'
import Select from '@/components/ui/Select'
import SearchBar from '@/components/ui/SearchBar'
import InformationCard from '@/components/ui/InformationCard'
import Button from '@/components/ui/Button'
import type { CategoryId } from '@/factories/Factory'

const typeOptions = [
	{ value: 'TEXT', label: 'Texte' },
	{ value: 'IMAGE', label: 'Image' },
	{ value: 'VIDEO', label: 'Vidéo' },
]

const InformationsPage: React.FC = () => {
	const navigate = useNavigate()
	const { fetchPublicInformations, informations, pagination, isLoading } = useInformationStore()
	const { fetchPublicCategories, publicCategories: categories } = useCategoryStore()
	const [selectedCategory, setSelectedCategory] = useState<string>('')
	const [selectedType, setSelectedType] = useState<'' | 'TEXT' | 'IMAGE' | 'VIDEO'>('')
	const [searchInput, setSearchInput] = useState<string>('')
	const [searchQuery, setSearchQuery] = useState<string>('')

	useEffect(() => {
		fetchPublicCategories()
	}, [fetchPublicCategories])

	useEffect(() => {
		fetchInformations()
	}, [selectedCategory, searchQuery, selectedType])

	const fetchInformations = async () => {
		await fetchPublicInformations({
			type: selectedType !== '' ? selectedType : undefined,
			categoryId: selectedCategory || undefined,
			search: searchQuery || undefined,
		})
	}

	const handlePageChange = (page: number) => {
		fetchPublicInformations({
			type: selectedType !== '' ? selectedType : undefined,
			categoryId: selectedCategory || undefined,
			search: searchQuery || undefined,
			page,
		})
	}

	const handleSearch = () => {
		setSearchQuery(searchInput)
	}

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	const getCategoryName = (categoryId: CategoryId): string => {
		if (typeof categoryId === 'string') {
			const category = categories.find((c) => c.id === categoryId)
			return category ? category.name : 'Non catégorisé'
		}
		if (Array.isArray(categoryId)) {
			if (categoryId.length === 0) return 'Non catégorisé'
			const firstCategory = categoryId[0]
			if (typeof firstCategory === 'string') {
				const category = categories.find((c) => c.id === firstCategory)
				return category ? category.name : 'Non catégorisé'
			}
			return firstCategory.name
		}
		return 'Non catégorisé'
	}

	const tablePagination = pagination
		? {
				currentPage: pagination.currentPage || 1,
				totalPages: pagination.totalPages || 1,
				totalItems: pagination.totalItems || 0,
				itemsPerPage: pagination.itemsPerPage || 10,
		  }
		: undefined

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold text-gray-900'>Informations</h1>
				<p className='mt-2 text-gray-600'>Découvrez les dernières informations et actualités</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
				<Select
					label='Catégories'
					value={selectedCategory}
					onChange={setSelectedCategory}
					options={categories.map((category) => ({
						value: category.id,
						label: category.name,
					}))}
					placeholder='Catégories'
				/>
				<Select
					label='Types'
					value={selectedType}
					onChange={(v) => setSelectedType(v as '' | 'TEXT' | 'IMAGE' | 'VIDEO')}
					options={[{ value: '', label: 'Tous les types' }, ...typeOptions]}
					placeholder='Types'
				/>
				<div className='md:col-span-2 lg:col-span-2 flex items-end gap-2'>
					<div className='flex-1'>
						<SearchBar
							label='Rechercher'
							value={searchInput}
							onChange={setSearchInput}
							placeholder='Rechercher par titre...'
							onReset={() => setSearchInput('')}
							onKeyDown={handleSearchKeyDown}
						/>
					</div>
					<Button
						className='h-10 px-4'
						onClick={handleSearch}
						aria-label='Lancer la recherche'
					>
						Rechercher
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className='text-center text-fr-grey-dark py-12'>Chargement...</div>
			) : informations.length === 0 ? (
				<div className='text-center text-fr-grey-dark py-12'>Aucune information disponible</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
					{informations.map((info) => (
						<InformationCard
							key={info.id}
							info={info}
							categoryLabel={getCategoryName(info.categoryId)}
							onClick={() => navigate(`/informations/${info.id}`)}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			{tablePagination && tablePagination.totalPages > 1 && (
				<div className='flex justify-center gap-4 mt-6'>
					<Button
						disabled={tablePagination.currentPage === 1}
						onClick={() => handlePageChange(tablePagination.currentPage - 1)}
					>
						Précédent
					</Button>
					<Button
						disabled={tablePagination.currentPage === tablePagination.totalPages}
						onClick={() => handlePageChange(tablePagination.currentPage + 1)}
					>
						Suivant
					</Button>
				</div>
			)}
		</div>
	)
}

export default InformationsPage

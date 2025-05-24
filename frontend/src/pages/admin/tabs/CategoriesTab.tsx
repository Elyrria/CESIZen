import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import DataTable from '@/components/ui/DataTable'
import useStore from '@/stores/useStore'
import type { ICategory } from '@/factories/Factory'
import type { ColumnDef, CategoryModalState } from '@/types/admin'

const CategoriesTab: React.FC = () => {
	const { category } = useStore()
	const [modalState, setModalState] = useState<CategoryModalState>({
		isOpen: false,
		mode: 'create',
	})

	useEffect(() => {
		category.fetchAdminCategories()
	}, [])

	const categoryColumns: ColumnDef<ICategory>[] = [
		{
			header: 'Nom',
			accessorKey: 'name',
			cell: (item: ICategory) => <span className='font-medium'>{item.name}</span>,
		},
		{
			header: 'Statut',
			accessorKey: 'isActive',
			cell: (item: ICategory) => (
				<span
					className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
						item.isActive
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					}`}
				>
					{item.isActive ? 'Active' : 'Inactive'}
				</span>
			),
		},
		{
			header: 'Créé par',
			accessorKey: 'createdBy',
			cell: (item: ICategory) => <span className='text-sm'>{item.createdBy}</span>,
		},
		{
			header: 'Créé le',
			accessorKey: 'createdAt',
			cell: (item: ICategory) => (
				<span className='text-sm'>
					{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '-'}
				</span>
			),
		},
		{
			header: 'Actions',
			accessorKey: 'id',
			cell: (item: ICategory) => (
				<div className='flex gap-2 items-center'>
					<button
						onClick={() => handleEdit(item)}
						className='text-fr-blue hover:text-fr-blue-dark text-xs'
						title='Modifier'
					>
						✏️
					</button>
					<button
						onClick={() => handleDelete(item.id)}
						className='text-fr-red hover:text-fr-red-dark text-xs'
						title='Supprimer'
					>
						🗑️
					</button>
					<button
						onClick={() => handleToggleActive(item)}
						className={`text-xs px-2 py-1 rounded ${
							item.isActive
								? 'bg-red-100 text-red-800 hover:bg-red-200'
								: 'bg-green-100 text-green-800 hover:bg-green-200'
						}`}
						title={item.isActive ? 'Désactiver' : 'Activer'}
					>
						{item.isActive ? 'Désactiver' : 'Activer'}
					</button>
				</div>
			),
		},
	]

	const handleCreate = useCallback(() => {
		setModalState({ isOpen: true, mode: 'create' })
	}, [])

	const handleEdit = useCallback((item: ICategory) => {
		setModalState({ isOpen: true, mode: 'edit', item })
	}, [])

	const handleDelete = useCallback(async (id: string) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
			const success = await category.deleteCategory(id)
			if (success) {
				toast.success('Catégorie supprimée avec succès')
			} else {
				toast.error(category.error || 'Erreur lors de la suppression')
			}
		}
	}, [])

	const handleToggleActive = useCallback(async (item: ICategory) => {
		const success = await category.updateCategory(item.id, {
			isActive: !item.isActive,
		})

		if (success) {
			toast.success(`Catégorie ${!item.isActive ? 'activée' : 'désactivée'} avec succès`)
		} else {
			toast.error(category.error || 'Erreur lors du changement de statut')
		}
	}, [])

	const handleSubmitCategory = useCallback(
		async (categoryData: { name: string; isActive: boolean }): Promise<boolean> => {
			if (modalState.mode === 'create') {
				const result = await category.createCategory(categoryData)
				if (result) {
					toast.success('Catégorie créée avec succès')
					setModalState({ isOpen: false, mode: 'create' })
					return true
				} else {
					toast.error(category.error || 'Erreur lors de la création')
				}
			} else if (modalState.item) {
				const success = await category.updateCategory(modalState.item.id, categoryData)
				if (success) {
					toast.success('Catégorie mise à jour')
					setModalState({ isOpen: false, mode: 'create' })
					return true
				} else {
					toast.error(category.error || 'Erreur lors de la mise à jour')
				}
			}
			return false
		},
		[modalState.mode, modalState.item, category]
	)

	const handleCloseModal = useCallback(() => {
		setModalState({ isOpen: false, mode: 'create' })
	}, [])

	// Protection against undefined data with type safety
	const categoryData: ICategory[] = category.categories ?? []

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-fr-blue'>Gestion des Catégories</h2>
				<button onClick={handleCreate} className='fr-btn fr-btn--primary'>
					Créer une catégorie
				</button>
			</div>

			<DataTable<ICategory>
				data={categoryData}
				columns={categoryColumns}
				pagination={undefined}
				isLoading={category.isLoading}
			/>

			{/* Simple modal for categories */}
			{modalState.isOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg max-w-md w-full mx-4'>
						<h3 className='text-lg font-semibold mb-4'>
							{modalState.mode === 'create'
								? 'Créer une catégorie'
								: 'Modifier la catégorie'}
						</h3>

						<form
							onSubmit={(e) => {
								e.preventDefault()
								const formData = new FormData(e.currentTarget)
								handleSubmitCategory({
									name: formData.get('name') as string,
									isActive: formData.get('isActive') === 'on',
								})
							}}
							className='space-y-6'
						>
							<div>
								<label
									className='block text-gray-700 mb-2'
									htmlFor='categoryName'
								>
									Nom de la catégorie
								</label>
								<input
									id='categoryName'
									type='text'
									name='name'
									placeholder='Nom de la catégorie'
									className='w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue'
									defaultValue={modalState.item?.name || ''}
									required
								/>
							</div>

							<div className='flex items-center space-x-2'>
								<div className='relative flex items-center'>
									<input
										type='checkbox'
										id='categoryActive'
										name='isActive'
										className='peer w-5 h-5 appearance-none rounded border border-gray-300 bg-white checked:bg-white focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue'
										defaultChecked={
											modalState.item?.isActive ??
											true
										}
									/>
									{/* Custom checkmark */}
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
								<label
									htmlFor='categoryActive'
									className='text-gray-700'
								>
									Catégorie active
								</label>
							</div>

							<div className='flex justify-end gap-4 pt-4'>
								<button
									type='button'
									onClick={handleCloseModal}
									className='px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue transition-colors'
								>
									Annuler
								</button>
								<button
									type='submit'
									className='px-6 py-3 bg-fr-blue text-white rounded-md font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fr-blue transition-colors'
								>
									{modalState.mode === 'create'
										? 'Créer'
										: 'Mettre à jour'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default CategoriesTab

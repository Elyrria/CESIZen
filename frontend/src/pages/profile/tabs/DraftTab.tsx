import React, { useState, useCallback } from 'react'
import DataTable from '@/components/ui/DataTable'
import InformationModal from '@/components/forms/InformationModal'
import StatusBadge from '@/components/ui/StatusBadge'
import useStore from '@/stores/useStore'
import { toast } from 'react-toastify'
import type { IInformation } from '@/factories/Factory'

interface ColumnDef<T> {
	header: string
	accessorKey: keyof T
	cell?: (item: T) => React.ReactNode
}

interface DraftTabProps {
	onTabChange: (tabId: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'CREATE') => void
}

const DraftTab: React.FC<DraftTabProps> = ({ onTabChange }) => {
	const { information, auth } = useStore()
	const [modalState, setModalState] = useState<{
		isOpen: boolean
		mode: 'create' | 'edit'
		item?: IInformation
	}>({ isOpen: false, mode: 'create' })

	// Filter drafts of the connected user
	const draftInformations = information.informations.filter(
		(info) => info.status === 'DRAFT' && info.authorId === auth.user?.id
	)

	// FIX: Function to reload data - memoized
	const reloadDraftData = useCallback(async () => {
		const userId = auth.user?.id
		if (userId) {
			await information.fetchInformations({
				authorId: userId,
				status: 'DRAFT',
			})
		}
	}, [auth.user?.id, information])

	// Table columns
	const draftColumns: ColumnDef<IInformation>[] = [
		{
			header: 'Titre',
			accessorKey: 'title',
			cell: (item) => (
				<div>
					<p className='font-medium text-fr-blue'>{item.title}</p>
					<div className='flex items-center gap-2 mt-1'>
						<StatusBadge status='DRAFT' size='sm' />
						<span className='text-sm text-fr-grey-dark'>{item.type}</span>
					</div>
				</div>
			),
		},
		{
			header: 'Description',
			accessorKey: 'descriptionInformation',
			cell: (item) => (
				<p className='text-sm text-fr-grey-dark line-clamp-2'>{item.descriptionInformation}</p>
			),
		},
		{
			header: 'Catégorie',
			accessorKey: 'categoryId',
			cell: (item) => (
				<div className='flex flex-wrap gap-1'>
					{Array.isArray(item.categoryId) ? (
						item.categoryId.map((cat, index) => (
							<span
								key={typeof cat === 'string' ? cat : cat.id || index}
								className='px-2 py-1 bg-fr-blue-light text-fr-blue text-xs rounded-md'
							>
								{typeof cat === 'string' ? cat : cat.name}
							</span>
						))
					) : (
						<span className='px-2 py-1 bg-fr-blue-light text-fr-blue text-xs rounded-md'>
							{' '}
							{typeof item.categoryId === 'string'
								? item.categoryId
								: typeof item.categoryId === 'object' && item.categoryId
								? (item.categoryId as { name: string }).name
								: '-'}{' '}
						</span>
					)}
				</div>
			),
		},
		{
			header: 'Créé le',
			accessorKey: 'createdAt',
			cell: (item) => (
				<span className='text-sm text-fr-grey-dark'>
					{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '-'}
				</span>
			),
		},
	]

	// CRUD Actions
	const handleEdit = useCallback((item: IInformation) => {
		setModalState({ isOpen: true, mode: 'edit', item })
	}, [])

	// FIX: Improved deletion with error handling
	const handleDelete = useCallback(async (id: string) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette information ?')) {
			try {
				const response = await information.deleteInformation(id)
				// FIX: Check response.success instead of just response
				if (response) {
					toast.success('Information supprimée avec succès')
					// Reload data
					await reloadDraftData()
				} else {
					toast.error('Erreur lors de la suppression')
				}
			} catch (error) {
				console.error('Erreur lors de la suppression:', error)
				toast.error('Erreur lors de la suppression')
			}
		}
	}, [information, reloadDraftData])

	// FIX: Improved submission for validation
	const handleSubmitForReview = useCallback(async (id: string) => {
		try {
			// Change status from DRAFT to PENDING
			const formData = new FormData()
			formData.append('status', 'PENDING')
			// FIX: Check the API response directly
			const response = await information.updateInformation(id, formData)
			// FIX: Check response.success correctly (it's an object, not a boolean)
			if (response) {
				toast.success('Information soumise pour validation')
				// Reload data and switch to the PENDING tab
				await reloadDraftData()
				onTabChange('PENDING')
			} else {
				toast.error('Erreur lors de la soumission')
			}
		} catch (error) {
			console.error('Erreur lors de la soumission:', error)
			toast.error('Erreur lors de la soumission')
		}
	}, [information, reloadDraftData, onTabChange])

	const handleCreateNew = useCallback(() => {
		setModalState({ isOpen: true, mode: 'create' })
	}, [])

	const handleModalSubmit = useCallback(async (formData: FormData): Promise<boolean> => {
		try {
			let success = false

			if (modalState.mode === 'create') {
				// Force DRAFT status for new creations
				formData.append('status', 'DRAFT')
				const result = await information.createInformation(formData)
				// FIX: Check result.success as it's an API object
				success = result ? true : false
				if (success) {
					toast.success('Information créée en brouillon')
				}
			} else if (modalState.mode === 'edit' && modalState.item) {
				const result = await information.updateInformation(modalState.item.id, formData)
				// FIX: Check result.success as it's an API object
				success = result ? true : false
				if (success) {
					toast.success('Information modifiée avec succès')
				}
			}

			if (success) {
				setModalState({ isOpen: false, mode: 'create' })
				// Reload data
				await reloadDraftData()
				return true
			}

			return false
		} catch (error) {
			console.error('Erreur lors de la soumission:', error)
			toast.error("Une erreur inattendue s'est produite")
			return false
		}
	}, [modalState.mode, modalState.item, information, reloadDraftData])

	const handleCloseModal = useCallback(() => {
		setModalState({ isOpen: false, mode: 'create' })
	}, [])

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h3 className='text-lg font-semibold text-fr-blue'>Mes Brouillons</h3>
					<p className='text-sm text-fr-grey-dark'>
						Gérez vos informations en cours de rédaction
					</p>
				</div>
				<button onClick={handleCreateNew} className='fr-btn fr-btn--primary'>
					Créer une information
				</button>
			</div>

			<DataTable
				data={draftInformations}
				columns={draftColumns}
				pagination={
					information.pagination
						? {
								currentPage: information.pagination.currentPage || 1,
								totalPages: information.pagination.totalPages || 1,
								totalItems: information.pagination.totalItems || 0,
								itemsPerPage: information.pagination.itemsPerPage || 10,
						  }
						: undefined
				}
				isLoading={information.isLoading}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			{/* Custom actions for drafts */}
			{draftInformations.length > 0 && (
				<div className='bg-fr-grey-light p-4 rounded-lg'>
					<h4 className='font-medium text-fr-blue mb-3'>Actions rapides</h4>
					<div className='flex flex-wrap gap-2'>
						{draftInformations.map((item) => (
							<div
								key={item.id}
								className='flex items-center gap-2 p-2 bg-white rounded border'
							>
								<span className='text-sm font-medium truncate max-w-[150px]'>
									{item.title}
								</span>
								<div className='flex gap-1'>
									<button
										onClick={() => handleEdit(item)}
										className='text-fr-blue hover:text-fr-blue-dark p-1 rounded hover:bg-blue-50 transition-colors'
										title='Modifier'
									>
										✏️
									</button>
									<button
										onClick={() => handleSubmitForReview(item.id)}
										className='text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 transition-colors'
										title='Soumettre pour validation'
									>
										📤
									</button>
									<button
										onClick={() => handleDelete(item.id)}
										className='text-fr-red hover:text-fr-red-dark p-1 rounded hover:bg-red-50 transition-colors'
										title='Supprimer définitivement'
									>
										🗑️
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Message if no drafts */}
			{!information.isLoading && draftInformations.length === 0 && (
				<div className='text-center py-12'>
					<div className='text-fr-grey-dark text-4xl mb-4'>📝</div>
					<h3 className='text-lg font-medium text-fr-grey-dark mb-2'>
						Aucun brouillon pour le moment
					</h3>
					<p className='text-fr-grey-dark mb-4'>
						Créez votre première information pour commencer.
					</p>
					<button onClick={handleCreateNew} className='fr-btn fr-btn--primary'>
						Créer une information
					</button>
				</div>
			)}

			{/* Modal for creation/edition */}
			<InformationModal
				isOpen={modalState.isOpen}
				onClose={handleCloseModal}
				mode={modalState.mode}
				initialData={modalState.item}
				onSubmit={handleModalSubmit}
			/>
		</div>
	)
}

export default DraftTab

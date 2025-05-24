import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import DataTable from '@/components/ui/DataTable'
import InformationModal from '@/components/forms/InformationModal'
import StatusBadge from '@/components/ui/StatusBadge'
import useStore from '@/stores/useStore'
import type { IInformation, InformationStatus } from '@/factories/Factory'
import type { ColumnDef, InformationModalState } from '@/types/admin'
import { isAuthorObject, isCategoryObject } from '@/types/admin'

const InformationsTab: React.FC = () => {
	const { information, category } = useStore()
	const [modalState, setModalState] = useState<InformationModalState>({
		isOpen: false,
		mode: 'create',
	})

	useEffect(() => {
		information.fetchInformations()
		category.fetchAdminCategories()
	}, [])

	const informationColumns: ColumnDef<IInformation>[] = [
		{
			header: 'Titre',
			accessorKey: 'title',
			cell: (item: IInformation) => (
				<div>
					<p className='font-medium'>{item.title}</p>
					<p className='text-sm text-fr-grey-dark capitalize'>
						{item.type.toLowerCase()}
					</p>
				</div>
			),
		},
		{
			header: 'Auteur',
			accessorKey: 'authorId',
			cell: (item: IInformation) => {
				if (typeof item.authorId === 'string') {
					return <span className='text-sm'>{item.authorId}</span>
				}
				if (isAuthorObject(item.authorId)) {
					return <span className='text-sm'>{item.authorId.name}</span>
				}
				return <span className='text-sm'>Inconnu</span>
			},
		},
		{
			header: 'Statut',
			accessorKey: 'status',
			cell: (item: IInformation) => <StatusBadge status={item.status} size='sm' />,
		},
		{
			header: 'Catégories',
			accessorKey: 'categoryId',
			cell: (item: IInformation) => (
				<div className='flex flex-wrap gap-1'>
					{Array.isArray(item.categoryId) ? (
						item.categoryId.slice(0, 2).map((cat, index) => (
							<span
								key={index}
								className='px-2 py-1 bg-fr-blue-light text-fr-blue text-xs rounded'
							>
								{typeof cat === 'string'
									? cat
									: isCategoryObject(cat)
									? cat.name
									: 'Catégorie'}
							</span>
						))
					) : (
						<span className='px-2 py-1 bg-fr-blue-light text-fr-blue text-xs rounded'>
							{typeof item.categoryId === 'string'
								? item.categoryId
								: isCategoryObject(item.categoryId)
								? (item.categoryId as { name: string }).name
								: 'Catégorie'}
						</span>
					)}
				</div>
			),
		},
		{
			header: 'Créé le',
			accessorKey: 'createdAt',
			cell: (item: IInformation) => (
				<span className='text-sm'>
					{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '-'}
				</span>
			),
		},
		{
			header: 'Actions',
			accessorKey: 'id',
			cell: (item: IInformation) => (
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
					<select
						value={item.status}
						onChange={(e) =>
							handleStatusChange(item.id, e.target.value as InformationStatus)
						}
						className='text-xs px-3 py-2 rounded-md bg-gray-50 text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue cursor-pointer'
					>
						<option value='DRAFT'>Brouillon</option>
						<option value='PENDING'>En attente</option>
						<option value='PUBLISHED'>Publié</option>
					</select>
				</div>
			),
		},
	]

	const handleCreate = useCallback(() => {
		setModalState({ isOpen: true, mode: 'create' })
	}, [])

	const handleEdit = useCallback((item: IInformation) => {
		setModalState({ isOpen: true, mode: 'edit', item })
	}, [])

	const handleDelete = useCallback(async (id: string) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette information ?')) {
			const success = await information.deleteInformation(id)
			if (success) {
				toast.success('Information supprimée avec succès')
			} else {
				toast.error(information.error || 'Erreur lors de la suppression')
			}
		}
	}, [])

	const handleStatusChange = useCallback(async (id: string, newStatus: InformationStatus) => {
		const formData = new FormData()
		formData.append('status', newStatus)

		const success = await information.updateInformation(id, formData)
		if (success) {
			toast.success(`Statut changé vers ${getStatusLabel(newStatus)}`)
		} else {
			toast.error(information.error || 'Erreur lors du changement de statut')
		}
	}, [])

	const getStatusLabel = (status: InformationStatus): string => {
		switch (status) {
			case 'DRAFT':
				return 'Brouillon'
			case 'PENDING':
				return 'En attente'
			case 'PUBLISHED':
				return 'Publié'
			default:
				return status
		}
	}

	const handleSubmit = useCallback(
		async (formData: FormData): Promise<boolean> => {
			if (modalState.mode === 'create') {
				const result = await information.createInformation(formData)
				if (result) {
					toast.success('Information créée avec succès')
					setModalState({ isOpen: false, mode: 'create' })
					return true
				} else {
					toast.error(information.error || 'Erreur lors de la création')
				}
			} else if (modalState.item) {
				const success = await information.updateInformation(modalState.item.id, formData)
				if (success) {
					toast.success('Information mise à jour')
					setModalState({ isOpen: false, mode: 'create' })
					return true
				} else {
					toast.error(information.error || 'Erreur lors de la mise à jour')
				}
			}
			return false
		},
		[modalState.mode, modalState.item]
	)

	const handleCloseModal = useCallback(() => {
		setModalState({ isOpen: false, mode: 'create' })
	}, [])

	// Protection against undefined data with type safety
	const informationData: IInformation[] = information.informations ?? []

	const handlePageChange = useCallback(
		(page: number) => {
			information.fetchInformations({ page })
		},
		[information]
	)

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-fr-blue'>Gestion des Informations</h2>
				<button onClick={handleCreate} className='fr-btn fr-btn--primary'>
					Créer une information
				</button>
			</div>

			<DataTable<IInformation>
				data={informationData}
				columns={informationColumns}
				pagination={
					information.pagination?.currentPage && information.pagination?.totalPages
						? {
								currentPage: information.pagination.currentPage,
								totalPages: information.pagination.totalPages,
								totalItems: information.pagination.totalItems ?? 0,
								itemsPerPage: information.pagination.itemsPerPage ?? 10,
						  }
						: undefined
				}
				isLoading={information.isLoading}
				onPageChange={handlePageChange}
			/>

			<InformationModal
				isOpen={modalState.isOpen}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
				mode={modalState.mode}
				initialData={modalState.item}
				categories={category.categories}
			/>
		</div>
	)
}

export default InformationsTab

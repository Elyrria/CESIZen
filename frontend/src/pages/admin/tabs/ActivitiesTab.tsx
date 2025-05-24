import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import DataTable from '@/components/ui/DataTable'
import useStore from '@/stores/useStore'
import type { IActivity } from '@/factories/Factory'
import type { ColumnDef, ActivityModalState } from '@/types/admin'
import { isAuthorObject, isCategoryObject } from '@/types/admin'

const ActivitiesTab: React.FC = () => {
	const { activity } = useStore()
	const [modalState, setModalState] = useState<ActivityModalState>({
		isOpen: false,
		mode: 'create',
	})

	useEffect(() => {
		activity.fetchActivities()
	}, [])

	const activityColumns: ColumnDef<IActivity>[] = [
		{
			header: 'Nom',
			accessorKey: 'name',
			cell: (item: IActivity) => (
				<div>
					<p className='font-medium'>{item.name}</p>
					{item.type && (
						<p className='text-sm text-fr-grey-dark capitalize'>
							{item.type.toLowerCase()}
						</p>
					)}
				</div>
			),
		},
		{
			header: 'Description',
			accessorKey: 'descriptionActivity',
			cell: (item: IActivity) => (
				<p className='text-sm text-fr-grey-dark truncate max-w-48'>
					{item.descriptionActivity || 'Aucune description'}
				</p>
			),
		},
		{
			header: 'Auteur',
			accessorKey: 'authorId',
			cell: (item: IActivity) => {
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
			accessorKey: 'isActive',
			cell: (item: IActivity) => (
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
			header: 'Catégories',
			accessorKey: 'categoryId',
			cell: (item: IActivity) => {
				if (!item.categoryId) {
					return <span className='text-sm text-gray-400'>Aucune catégorie</span>
				}

				if (Array.isArray(item.categoryId)) {
					return (
						<div className='flex flex-wrap gap-1'>
							{item.categoryId.slice(0, 2).map((cat, index) => (
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
							))}
						</div>
					)
				} else {
					return (
						<span className='px-2 py-1 bg-fr-blue-light text-fr-blue text-xs rounded'>
							{typeof item.categoryId === 'string'
								? item.categoryId
								: isCategoryObject(item.categoryId)
								? (item.categoryId as { name: string }).name
								: 'Catégorie'}
						</span>
					)
				}
			},
		},
		{
			header: 'Créé le',
			accessorKey: 'createdAt',
			cell: (item: IActivity) => (
				<span className='text-sm'>
					{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '-'}
				</span>
			),
		},
		{
			header: 'Actions',
			accessorKey: 'id',
			cell: (item: IActivity) => (
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

	const handleEdit = useCallback((item: IActivity) => {
		toast.info("Modal d'édition d'activité à implémenter")
		setModalState({ isOpen: true, mode: 'edit', item })
	}, [])

	const handleDelete = useCallback(async (id: string) => {
		console.log(id)
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
			const success = await activity.deleteActivity(id)
			console.log(success)
			if (success) {
				toast.success('Activité supprimée avec succès')
			} else {
				toast.error(activity.error || 'Erreur lors de la suppression')
			}
		}
	}, [])

	const handleToggleActive = useCallback(async (item: IActivity) => {
		const formData = new FormData()
		formData.append('isActive', (!item.isActive).toString())

		const success = await activity.updateActivity(item.id, formData)
		if (success) {
			toast.success(`Activité ${!item.isActive ? 'activée' : 'désactivée'} avec succès`)
		} else {
			toast.error(activity.error || 'Erreur lors du changement de statut')
		}
	}, [])

	const handleCloseModal = useCallback(() => {
		setModalState({ isOpen: false, mode: 'create' })
	}, [])

	// Protection against undefined data with type safety
	const activityData: IActivity[] = activity.activities ?? []

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-fr-blue'>Gestion des Activités</h2>
				<button onClick={handleCreate} className='fr-btn fr-btn--primary'>
					Créer une activité
				</button>
			</div>

			<DataTable<IActivity>
				data={activityData}
				columns={activityColumns}
				pagination={
					activity.pagination?.currentPage && activity.pagination?.totalPages
						? {
								currentPage: activity.pagination.currentPage,
								totalPages: activity.pagination.totalPages,
								totalItems: activity.pagination.totalItems ?? 0,
								itemsPerPage: activity.pagination.itemsPerPage ?? 10,
						  }
						: undefined
				}
				isLoading={activity.isLoading}
			/>

			{modalState.isOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg max-w-md'>
						<h3 className='text-lg font-semibold mb-4'>
							{modalState.mode === 'create'
								? 'Créer une activité'
								: "Modifier l'activité"}
						</h3>
						<p className='mb-4'>Modal d'activité à implémenter</p>
						<div className='flex gap-2'>
							<button
								onClick={handleCloseModal}
								className='fr-btn fr-btn--secondary'
							>
								Fermer
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ActivitiesTab

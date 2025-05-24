import React from 'react'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import useStore from '@/stores/useStore'
import type { IInformation } from '@/factories/Factory'

interface ColumnDef<T> {
	header: string
	accessorKey: keyof T
	cell?: (item: T) => React.ReactNode
}

const PendingTab: React.FC = () => {
	const { information, auth } = useStore()

	// Filter pending information of the connected user
	const pendingInformations = information.informations.filter(
		(info) => info.status === 'PENDING' && info.authorId === auth.user?.id
	)

	// Table columns (read-only)
	const pendingColumns: ColumnDef<IInformation>[] = [
		{
			header: 'Titre',
			accessorKey: 'title',
			cell: (item) => (
				<div>
					<p className='font-medium text-fr-blue'>{item.title}</p>
					<div className='flex items-center gap-2 mt-1'>
						<StatusBadge status='PENDING' size='sm' />
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
							{typeof item.categoryId === 'string'
								? item.categoryId
								: typeof item.categoryId === 'object' && item.categoryId
								? (item.categoryId as { name: string }).name
								: '-'}
						</span>
					)}
				</div>
			),
		},
		{
			header: 'Soumis le',
			accessorKey: 'updatedAt',
			cell: (item) => (
				<span className='text-sm text-fr-grey-dark'>
					{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('fr-FR') : '-'}
				</span>
			),
		},
		{
			header: 'Statut',
			accessorKey: 'status',
			cell: () => (
				<div className='flex flex-col gap-1'>
					{' '}
					<StatusBadge status='PENDING' size='sm' />{' '}
					<span className='text-xs text-fr-grey-dark'>En cours de validation</span>{' '}
				</div>
			),
		},
	]

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h3 className='text-lg font-semibold text-fr-blue'>En Attente de Validation</h3>
					<p className='text-sm text-fr-grey-dark'>
						Vos informations soumises à l'équipe de modération
					</p>
				</div>
				<div className='text-sm text-fr-grey-dark'>
					{pendingInformations.length} information
					{pendingInformations.length !== 1 ? 's' : ''} en attente
				</div>
			</div>

			{/* Information on the validation process */}
			<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
				<div className='flex items-start gap-3'>
					<div className='text-yellow-600 text-lg'>⏳</div>
					<div>
						<h4 className='font-medium text-yellow-800 mb-1'>
							Processus de validation
						</h4>
						<p className='text-sm text-yellow-700'>
							Vos informations sont actuellement en cours de validation par
							notre équipe. Vous recevrez une notification une fois le
							processus terminé. Le délai moyen est de 1-2 jours ouvrés.
						</p>
					</div>
				</div>
			</div>

			<DataTable
				data={pendingInformations}
				columns={pendingColumns}
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
			/>

			{/* Message if no pending information */}
			{!information.isLoading && pendingInformations.length === 0 && (
				<div className='text-center py-12'>
					<div className='text-fr-grey-dark text-4xl mb-4'>📝</div>
					<h3 className='text-lg font-medium text-fr-grey-dark mb-2'>
						Aucune information en attente
					</h3>
					<p className='text-fr-grey-dark'>
						Vos prochaines soumissions apparaîtront ici pendant leur validation.
					</p>
				</div>
			)}

			{/* Additional information */}
			{pendingInformations.length > 0 && (
				<div className='bg-fr-grey-light p-4 rounded-lg'>
					<h4 className='font-medium text-fr-blue mb-3'>Informations importantes</h4>
					<ul className='space-y-2 text-sm text-fr-grey-dark'>
						<li className='flex items-start gap-2'>
							<span className='text-fr-blue'>•</span>
							<span>
								Vos informations sont en cours de validation par notre
								équipe de modération.
							</span>
						</li>
						<li className='flex items-start gap-2'>
							<span className='text-fr-blue'>•</span>
							<span>
								Vous ne pouvez plus modifier le contenu une fois soumis.
							</span>
						</li>
						<li className='flex items-start gap-2'>
							<span className='text-fr-blue'>•</span>
							<span>
								Si des modifications sont nécessaires, l'information
								sera renvoyée en brouillon.
							</span>
						</li>
						<li className='flex items-start gap-2'>
							<span className='text-fr-blue'>•</span>
							<span>
								Une fois validées, vos informations seront
								automatiquement publiées.
							</span>
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

export default PendingTab

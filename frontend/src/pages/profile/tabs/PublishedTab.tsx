import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import useStore from '@/stores/useStore'
import type { IInformation } from '@/factories/Factory'

interface ColumnDef<T> {
	header: string
	accessorKey: keyof T
	cell?: (item: T) => React.ReactNode
}

const PublishedTab: React.FC = () => {
	const { information, auth } = useStore()

	// Filter published information of the connected user
	const publishedInformations = information.informations.filter(
		(info) => info.status === 'PUBLISHED' && info.authorId === auth.user?.id
	)

	// Table columns with links to public pages
	const publishedColumns: ColumnDef<IInformation>[] = [
		{
			header: 'Titre',
			accessorKey: 'title',
			cell: (item) => (
				<div>
					<Link
						to={`/informations/${item.id}`}
						className='font-medium text-fr-blue hover:text-fr-blue-dark hover:underline'
					>
						{item.title}
					</Link>
					<div className='flex items-center gap-2 mt-1'>
						<StatusBadge status='PUBLISHED' size='sm' />
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
			header: 'Publié le',
			accessorKey: 'validatedAndPublishedAt',
			cell: (item) => (
				<span className='text-sm text-fr-grey-dark'>
					{item.validatedAndPublishedAt
						? new Date(item.validatedAndPublishedAt).toLocaleDateString('fr-FR')
						: '-'}
				</span>
			),
		},
		{
			header: 'Actions',
			accessorKey: 'id',
			cell: (item) => (
				<div className='flex gap-2'>
					<Link
						to={`/informations/${item.id}`}
						className='inline-flex items-center gap-1 text-fr-blue hover:text-fr-blue-dark text-sm'
						title='Voir en ligne'
					>
						👁️ Voir
					</Link>
					<button
						onClick={() =>
							navigator.clipboard.writeText(
								`${window.location.origin}/informations/${item.id}`
							)
						}
						className='inline-flex items-center gap-1 text-fr-grey-dark hover:text-fr-blue text-sm'
						title='Copier le lien'
					>
						📋 Copier
					</button>
				</div>
			),
		},
	]

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h3 className='text-lg font-semibold text-fr-blue'>Mes Publications</h3>
					<p className='text-sm text-fr-grey-dark'>
						Vos informations validées et publiées en ligne
					</p>
				</div>
				<div className='text-sm text-fr-grey-dark'>
					{publishedInformations.length} publication
					{publishedInformations.length !== 1 ? 's' : ''}
				</div>
			</div>

			{/* Information on publications */}
			<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
				<div className='flex items-start gap-3'>
					<div className='text-green-600 text-lg'>✅</div>
					<div>
						<h4 className='font-medium text-green-800 mb-1'>
							Informations publiées
						</h4>
						<p className='text-sm text-green-700'>
							Ces informations sont maintenant visibles par tous les
							utilisateurs. Elles sont accessibles depuis la page publique des
							informations.
						</p>
					</div>
				</div>
			</div>

			<DataTable
				data={publishedInformations}
				columns={publishedColumns}
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

			{/* Message if no publications */}
			{!information.isLoading && publishedInformations.length === 0 && (
				<div className='text-center py-12'>
					<div className='text-fr-grey-dark text-4xl mb-4'>📰</div>
					<h3 className='text-lg font-medium text-fr-grey-dark mb-2'>
						Aucune publication pour le moment
					</h3>
					<p className='text-fr-grey-dark mb-4'>
						Vos informations validées apparaîtront ici une fois publiées.
					</p>
					<Link to='/informations' className='fr-btn fr-btn--secondary'>
						Voir toutes les publications
					</Link>
				</div>
			)}

			{/* Statistics and quick actions */}
			{publishedInformations.length > 0 && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Statistics */}
					<div className='bg-fr-grey-light p-4 rounded-lg'>
						<h4 className='font-medium text-fr-blue mb-3'>Statistiques</h4>
						<div className='space-y-2 text-sm'>
							<div className='flex justify-between'>
								<span className='text-fr-grey-dark'>
									Total publié :
								</span>
								<span className='font-medium'>
									{publishedInformations.length}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-fr-grey-dark'>Type TEXT :</span>
								<span className='font-medium'>
									{
										publishedInformations.filter(
											(i) => i.type === 'TEXT'
										).length
									}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-fr-grey-dark'>Type IMAGE :</span>
								<span className='font-medium'>
									{
										publishedInformations.filter(
											(i) => i.type === 'IMAGE'
										).length
									}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-fr-grey-dark'>Type VIDEO :</span>
								<span className='font-medium'>
									{
										publishedInformations.filter(
											(i) => i.type === 'VIDEO'
										).length
									}
								</span>
							</div>
						</div>
					</div>

					{/* Quick actions */}
					<div className='bg-fr-grey-light p-4 rounded-lg'>
						<h4 className='font-medium text-fr-blue mb-3'>Actions rapides</h4>
						<div className='space-y-3'>
							<Link
								to='/informations'
								className='block w-full text-center fr-btn fr-btn--secondary'
							>
								Voir toutes les publications
							</Link>
							<button
								onClick={() => {
									const links = publishedInformations
										.map(
											(info) =>
												`${window.location.origin}/informations/${info.id}`
										)
										.join('\n')
									navigator.clipboard.writeText(links)
								}}
								className='w-full fr-btn fr-btn--tertiary'
							>
								Copier tous les liens
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Recent publications */}
			{publishedInformations.length > 0 && (
				<div className='bg-white border border-fr-grey-light rounded-lg p-4'>
					<h4 className='font-medium text-fr-blue mb-3'>Publications récentes</h4>
					<div className='space-y-2'>
						{publishedInformations
							.sort(
								(a, b) =>
									new Date(
										b.validatedAndPublishedAt || ''
									).getTime() -
									new Date(
										a.validatedAndPublishedAt || ''
									).getTime()
							)
							.slice(0, 3)
							.map((item) => (
								<div
									key={item.id}
									className='flex items-center justify-between p-2 hover:bg-fr-grey-light rounded'
								>
									<div>
										<Link
											to={`/informations/${item.id}`}
											className='font-medium text-fr-blue hover:underline'
										>
											{item.title}
										</Link>
										<p className='text-sm text-fr-grey-dark'>
											Publié le{' '}
											{item.validatedAndPublishedAt
												? new Date(
														item.validatedAndPublishedAt
												  ).toLocaleDateString(
														'fr-FR'
												  )
												: ''}
										</p>
									</div>
									<Link
										to={`/informations/${item.id}`}
										className='text-fr-blue hover:text-fr-blue-dark'
									>
										→
									</Link>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	)
}

export default PublishedTab

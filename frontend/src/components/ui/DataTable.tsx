import React, { useState } from 'react'

interface Pagination {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
}

interface FilterConfig {
	name: string
	label: string
	type: 'text' | 'select' | 'date'
	options?: { value: string; label: string }[]
}

interface ColumnDef<T> {
	header: string
	accessorKey: keyof T
	cell?: (item: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
	data: T[]
	columns: ColumnDef<T>[]
	pagination?: Pagination
	isLoading?: boolean
	onEdit?: (item: T) => void
	onDelete?: (id: string) => void
	onStatusChange?: (id: string, status: string) => void
	filters?: FilterConfig[]
	onFilterChange?: (filters: Record<string, string>) => void
	onPageChange?: (page: number) => void
}

const DataTable = <T extends { id: string }>({
	data,
	columns,
	pagination,
	isLoading = false,
	onEdit,
	onDelete,
	onStatusChange,
	filters,
	onFilterChange,
	onPageChange,
}: DataTableProps<T>) => {
	const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

	const handleFilterChange = (name: string, value: string) => {
		const newFilters = { ...activeFilters, [name]: value }
		setActiveFilters(newFilters)
		onFilterChange?.(newFilters)
	}

	const renderFilter = (filter: FilterConfig) => {
		switch (filter.type) {
			case 'text':
				return (
					<input
						type='text'
						className='fr-input'
						placeholder={filter.label}
						value={activeFilters[filter.name] || ''}
						onChange={(e) => handleFilterChange(filter.name, e.target.value)}
					/>
				)
			case 'select':
				return (
					<select
						className='fr-select'
						value={activeFilters[filter.name] || ''}
						onChange={(e) => handleFilterChange(filter.name, e.target.value)}
					>
						<option value=''>{filter.label}</option>
						{filter.options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				)
			case 'date':
				return (
					<input
						type='date'
						className='fr-input'
						value={activeFilters[filter.name] || ''}
						onChange={(e) => handleFilterChange(filter.name, e.target.value)}
					/>
				)
			default:
				return null
		}
	}

	return (
		<div className='w-full'>
			{/* Filtres */}
			{filters && filters.length > 0 && (
				<div className='mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filters.map((filter) => (
						<div key={filter.name} className='flex flex-col'>
							<label className='fr-label mb-2'>{filter.label}</label>
							{renderFilter(filter)}
						</div>
					))}
				</div>
			)}

			{/* Table */}
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse'>
					<thead>
						<tr className='bg-fr-grey-light'>
							{columns.map((column) => (
								<th
									key={String(column.accessorKey)}
									className='px-4 py-2 text-left text-fr-grey-dark font-medium'
								>
									{column.header}
								</th>
							))}
							{(onEdit || onDelete || onStatusChange) && (
								<th className='px-4 py-2 text-right text-fr-grey-dark font-medium'>
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td
									colSpan={
										columns.length +
										(onEdit || onDelete || onStatusChange
											? 1
											: 0)
									}
									className='px-4 py-8 text-center text-fr-grey-dark'
								>
									Chargement...
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td
									colSpan={
										columns.length +
										(onEdit || onDelete || onStatusChange
											? 1
											: 0)
									}
									className='px-4 py-8 text-center text-fr-grey-dark'
								>
									Aucune donnée disponible
								</td>
							</tr>
						) : (
							data.map((item) => (
								<tr
									key={item.id}
									className='border-b border-fr-grey-light hover:bg-fr-grey-light/50'
								>
									{columns.map((column) => (
										<td
											key={String(column.accessorKey)}
											className='px-4 py-2'
										>
											{column.cell
												? column.cell(item)
												: String(
														item[
															column
																.accessorKey
														]
												  )}
										</td>
									))}
									{(onEdit || onDelete || onStatusChange) && (
										<td className='px-4 py-2 text-right'>
											<div className='flex justify-end gap-2'>
												{onEdit && (
													<button
														onClick={() =>
															onEdit(
																item
															)
														}
														className='text-fr-blue hover:text-fr-blue-dark'
														aria-label='Modifier'
													>
														<svg
															className='w-5 h-5'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={
																	2
																}
																d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
															/>
														</svg>
													</button>
												)}
												{onDelete && (
													<button
														onClick={() =>
															onDelete(
																item.id
															)
														}
														className='text-fr-red hover:text-fr-red-dark'
														aria-label='Supprimer'
													>
														<svg
															className='w-5 h-5'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={
																	2
																}
																d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
															/>
														</svg>
													</button>
												)}
											</div>
										</td>
									)}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{pagination && (
				<div className='mt-4 flex items-center justify-between'>
					<div className='text-sm text-fr-grey-dark'>
						Affichage de{' '}
						{(pagination.currentPage - 1) * pagination.itemsPerPage + 1} à{' '}
						{Math.min(
							pagination.currentPage * pagination.itemsPerPage,
							pagination.totalItems
						)}{' '}
						sur {pagination.totalItems} éléments
					</div>
					<div className='flex gap-2'>
						<button
							onClick={() => onPageChange?.(pagination.currentPage - 1)}
							disabled={pagination.currentPage === 1}
							className='fr-btn fr-btn--secondary'
						>
							Précédent
						</button>
						<button
							onClick={() => onPageChange?.(pagination.currentPage + 1)}
							disabled={pagination.currentPage === pagination.totalPages}
							className='fr-btn fr-btn--secondary'
						>
							Suivant
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default DataTable

import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import DataTable from '@/components/ui/DataTable'
import UserModal from '@/components/forms/UserModal'
import useStore from '@/stores/useStore'
import type { IUser } from '@/factories/Factory'
import type { ColumnDef, UserModalState } from '@/types/admin'

export interface UserFormData {
	email: string
	name: string
	firstName: string
	birthDate: string
	role: 'user' | 'administrator'
	password?: string
}

const UsersTab: React.FC = () => {
	const { user, auth } = useStore()
	const [modalState, setModalState] = useState<UserModalState>({
		isOpen: false,
		mode: 'create',
	})

	useEffect(() => {
		user.fetchUsers()
	}, [])

	const userColumns: ColumnDef<IUser>[] = [
		{
			header: 'Pseudonyme',
			accessorKey: 'name',
			cell: (item: IUser) => (
				<div>
					<p className='font-medium'>
						{item.name} {item.firstName}
					</p>
					<p className='text-sm text-fr-grey-dark'>{item.email}</p>
				</div>
			),
		},
		{
			header: 'Email',
			accessorKey: 'email',
			cell: (item: IUser) => <span className='text-sm'>{item.email}</span>,
		},
		{
			header: 'Rôle',
			accessorKey: 'role',
			cell: (item: IUser) => (
				<span
					className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
						item.role === 'administrator'
							? 'bg-fr-red-light text-fr-red-dark'
							: 'bg-fr-blue-light text-fr-blue-dark'
					}`}
				>
					{item.role === 'administrator' ? 'Admin' : 'Utilisateur'}
				</span>
			),
		},
		{
			header: 'Créé le',
			accessorKey: 'createdAt',
			cell: (item: IUser) => (
				<span className='text-sm'>
					{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '-'}
				</span>
			),
		},
		{
			header: 'Modifié le',
			accessorKey: 'updatedAt',
			cell: (item: IUser) => (
				<span className='text-sm'>
					{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('fr-FR') : '-'}
				</span>
			),
		},
		{
			header: 'Actions',
			accessorKey: 'id',
			cell: (item: IUser) => (
				<div className='flex gap-2'>
					<button
						onClick={() => handleView(item)}
						className='px-3 py-1 bg-fr-blue text-white text-xs rounded hover:bg-fr-blue-dark'
						title='Voir'
					>
						VOIR
					</button>
					<button
						onClick={() => handleEdit(item)}
						className='px-3 py-1 bg-fr-blue text-white text-xs rounded hover:bg-fr-blue-dark'
						title='Modifier'
					>
						MODIFIER
					</button>
					{/* Don't allow deleting the connected admin */}
					{item.id !== auth.user?.id && (
						<button
							onClick={() => handleDelete(item.id)}
							className='px-3 py-1 bg-fr-red text-white text-xs rounded hover:bg-fr-red-dark'
							title='Supprimer'
						>
							SUPPRIMER
						</button>
					)}
				</div>
			),
		},
	]

	const handleCreate = useCallback(() => {
		setModalState({ isOpen: true, mode: 'create' })
	}, [])

	const handleEdit = useCallback((item: IUser) => {
		setModalState({ isOpen: true, mode: 'edit', item })
	}, [])

	const handleView = useCallback((item: IUser) => {
		// For now, open in edit mode (read-only mode can be added later)
		setModalState({ isOpen: true, mode: 'edit', item })
	}, [])

	const handleDelete = useCallback(async (id: string) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
			const success = await user.deleteUser(id)
			if (success) {
				toast.success('Utilisateur supprimé avec succès')
			} else {
				toast.error(user.error || 'Erreur lors de la suppression')
			}
		}
	}, [])

	const handleSubmit = useCallback(
		async (formData: UserFormData): Promise<boolean> => {
			if (modalState.mode === 'create') {
				if (!formData.password) {
					toast.error('Le mot de passe est requis pour créer un utilisateur')
					return false
				}
				const result = await user.createUser({
					...formData,
					password: formData.password,
				})
				if (result) {
					toast.success('Utilisateur créé avec succès')
					setModalState({ isOpen: false, mode: 'create' })
					return true
				} else {
					toast.error(user.error || 'Erreur lors de la création')
				}
			} else if (modalState.item) {
				const success = await user.updateUser(modalState.item.id, formData)
				if (success) {
					toast.success('Utilisateur mis à jour')
					setModalState({ isOpen: false, mode: 'create' })
					return true
				} else {
					toast.error(user.error || 'Erreur lors de la mise à jour')
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
	const usersData: IUser[] = user.users ?? []


	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-fr-blue'>Gestion des Utilisateurs</h2>
				<button onClick={handleCreate} className='fr-btn fr-btn--primary'>
					Créer un utilisateur
				</button>
			</div>

			<DataTable<IUser>
				data={usersData}
				columns={userColumns}
				pagination={
					user.pagination?.currentPage && user.pagination?.totalPages
						? {
								currentPage: user.pagination.currentPage,
								totalPages: user.pagination.totalPages,
								totalItems: user.pagination.totalItems ?? 0,
								itemsPerPage: user.pagination.itemsPerPage ?? 10,
						  }
						: undefined
				}
				isLoading={user.isLoading}
			/>

			<UserModal
				isOpen={modalState.isOpen}
				onClose={handleCloseModal}
				mode={modalState.mode}
				initialData={modalState.item}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}

export default UsersTab

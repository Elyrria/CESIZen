import React from 'react'
import Modal from '@/components/ui/Modal'
import UserForm from './UserForm'
import useStore from '@/stores/useStore'
import type { IUser } from '@/factories/Factory'
import type { UserFormData } from '@/pages/admin/tabs/UsersTab'

interface UserModalProps {
	isOpen: boolean
	onClose: () => void
	mode: 'create' | 'edit'
	initialData?: IUser
	onSubmit: (userData: UserFormData) => Promise<boolean>
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, mode, initialData, onSubmit }) => {
	const { user } = useStore()

	const handleSubmit = async (formData: UserFormData): Promise<boolean> => {
		const success = await onSubmit(formData)
		return success
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={mode === 'create' ? 'Créer un Utilisateur' : "Modifier l'Utilisateur"}
			size='lg'
		>
			<UserForm
				initialData={initialData}
				onSubmit={handleSubmit}
				onCancel={onClose}
				isLoading={user.isLoading}
				mode={mode}
			/>
		</Modal>
	)
}

export default UserModal

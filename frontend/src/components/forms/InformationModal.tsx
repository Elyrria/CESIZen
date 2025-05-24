import React from 'react'
import Modal from '@/components/ui/Modal'
import InformationForm from './InformationForm'
import useStore from '@/stores/useStore'
import type { IInformation, ICategory } from '@/factories/Factory'

interface InformationModalProps {
	isOpen: boolean
	onClose: () => void
	mode: 'create' | 'edit'
	initialData?: IInformation
	onSubmit: (formData: FormData) => Promise<boolean>
	categories?: ICategory[]
}

const InformationModal: React.FC<InformationModalProps> = ({ isOpen, onClose, mode, initialData, onSubmit, categories }) => {
	const { category, information } = useStore()

	const handleSubmit = async (formData: FormData): Promise<boolean> => {
		const success = await onSubmit(formData)
		if (success) {
			onClose()
		}
		return success
	}

	const availableCategories = categories || category.publicCategories

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={mode === 'create' ? 'Créer une Information' : "Modifier l'Information"}
			size='xl'
		>
			<InformationForm
				initialData={initialData}
				onSubmit={handleSubmit}
				categories={availableCategories}
				isLoading={information.isLoading}
				mode={mode}
			/>
		</Modal>
	)
}

export default InformationModal

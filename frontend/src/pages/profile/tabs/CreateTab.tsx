import React from 'react'
import InformationForm from '@/components/forms/InformationForm'
import useStore from '@/stores/useStore'
import { toast } from 'react-toastify'

interface CreateTabProps {
	onTabChange: (tabId: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'CREATE') => void
	onDataChange?: () => Promise<void> // Addition of callback for badges
}

const CreateTab: React.FC<CreateTabProps> = ({ onTabChange, onDataChange }) => {
	const { information, category } = useStore()

	const handleCreateSubmit = async (formData: FormData): Promise<boolean> => {
		try {
			// Force DRAFT status for users
			formData.append('status', 'DRAFT')

			const result = await information.createInformation(formData)
			console.log(result)
			if (result) {
				toast.success('Information créée en brouillon')

				if (onDataChange) {
					await onDataChange()
				}

				// Redirect to the DRAFT tab to see the new item
				onTabChange('DRAFT')
				return true
			} else {
				toast.error("Erreur lors de la création de l'information")
				return false
			}
		} catch (error) {
			console.error('Erreur lors de la création:', error)
			toast.error("Une erreur inattendue s'est produite")
			return false
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h3 className='text-lg font-semibold text-fr-blue'>
						Créer une Nouvelle Information
					</h3>
					<p className='text-sm text-fr-grey-dark'>
						Rédigez et publiez du contenu pour la communauté
					</p>
				</div>
			</div>

			{/* Information on the creation process */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
				<div className='flex items-start gap-3'>
					<div className='text-blue-600 text-lg'>💡</div>
					<div>
						<h4 className='font-medium text-blue-800 mb-1'>
							Processus de publication
						</h4>
						<div className='text-sm text-blue-700 space-y-1'>
							<p>
								1. <strong>Création :</strong> Votre information sera
								sauvegardée en brouillon
							</p>
							<p>
								2. <strong>Révision :</strong> Vous pouvez la modifier
								autant que nécessaire
							</p>
							<p>
								3. <strong>Soumission :</strong> Envoyez-la pour
								validation quand elle est prête
							</p>
							<p>
								4. <strong>Publication :</strong> Elle sera publiée
								après validation par notre équipe
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Creation form */}
			<div className='bg-white border border-fr-grey-light rounded-lg p-6'>
				<InformationForm
					onSubmit={handleCreateSubmit}
					categories={category.publicCategories}
					isLoading={information.isLoading}
					mode='create'
				/>
			</div>

			{/* Writing tips */}
			<div className='bg-fr-grey-light p-4 rounded-lg'>
				<h4 className='font-medium text-fr-blue mb-3'>Conseils pour une bonne information</h4>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-fr-grey-dark'>
					<div>
						<h5 className='font-medium text-fr-blue mb-2'>✍️ Contenu</h5>
						<ul className='space-y-1'>
							<li>• Utilisez un titre clair et descriptif</li>
							<li>• Rédigez une description détaillée</li>
							<li>• Vérifiez l'orthographe et la grammaire</li>
							<li>• Ajoutez des sources si pertinent</li>
						</ul>
					</div>
					<div>
						<h5 className='font-medium text-fr-blue mb-2'>🎯 Organisation</h5>
						<ul className='space-y-1'>
							<li>• Choisissez la catégorie appropriée</li>
							<li>• Sélectionnez le bon type de contenu</li>
							<li>• Utilisez des images de qualité</li>
							<li>• Organisez le contenu de manière logique</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Available content types */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='bg-white border border-fr-grey-light rounded-lg p-4 text-center'>
					<div className='text-2xl mb-2'>📝</div>
					<h4 className='font-medium text-fr-blue mb-1'>Contenu Textuel</h4>
					<p className='text-sm text-fr-grey-dark'>
						Articles, guides, actualités et informations textuelles
					</p>
				</div>
				<div className='bg-white border border-fr-grey-light rounded-lg p-4 text-center'>
					<div className='text-2xl mb-2'>🖼️</div>
					<h4 className='font-medium text-fr-blue mb-1'>Images</h4>
					<p className='text-sm text-fr-grey-dark'>
						Photos, illustrations, infographies et contenus visuels
					</p>
				</div>
				<div className='bg-white border border-fr-grey-light rounded-lg p-4 text-center'>
					<div className='text-2xl mb-2'>🎥</div>
					<h4 className='font-medium text-fr-blue mb-1'>Vidéos</h4>
					<p className='text-sm text-fr-grey-dark'>
						Tutoriels, présentations et contenus audiovisuels
					</p>
				</div>
			</div>

			{/* Reminder about the rules */}
			<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
				<div className='flex items-start gap-3'>
					<div className='text-yellow-600 text-lg'>⚠️</div>
					<div>
						<h4 className='font-medium text-yellow-800 mb-1'>Rappel important</h4>
						<p className='text-sm text-yellow-700'>
							Assurez-vous que votre contenu respecte nos conditions
							d'utilisation. Les informations inappropriées ou contraires à
							nos règles seront refusées lors de la validation.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateTab

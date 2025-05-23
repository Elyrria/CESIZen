import { useParams, useNavigate } from 'react-router-dom'
import StatusBadge from '@/components/ui/StatusBadge'
import React, { useEffect } from 'react'
import useStore from '@/stores/useStore'

const InformationDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { information } = useStore()

	useEffect(() => {
		console.log("Changement d'id détecté", id)
		if (id) {
			loadInformation(id)
		}
	}, [id])

	// Utiliser selectedInformation du store et écouter ses changements
	useEffect(() => {
		console.log("selectedInformation a changé:", information.selectedInformation)
	}, [information.selectedInformation])

	const loadInformation = async (infoId: string) => {
		// Reset l'information sélectionnée avant de charger la nouvelle
		information.setSelectedInformation(null)
		// Charger la nouvelle information
		await information.fetchPublicInformationById(infoId)
	}

	const renderContent = () => {
		const currentInfo = information.selectedInformation
		if (!currentInfo) return null
		
		if (currentInfo.type === 'TEXT') {
			return (
				<div className='prose max-w-none'>
					<div dangerouslySetInnerHTML={{ __html: currentInfo.content || '' }} />
				</div>
			)
		}
		if (currentInfo.type === 'IMAGE') {
			return (
				<div className='flex flex-col items-center'>
					<img
						src={currentInfo.mediaUrl || ''}
						alt={currentInfo.descriptionInformation || ''}
						className='max-w-md w-full h-auto rounded-lg shadow-lg object-contain'
					/>
				</div>
			)
		}
		if (currentInfo.type === 'VIDEO') {
			return (
				<div className='aspect-w-16 aspect-h-9'>
					<video
						controls
						className='w-full h-full rounded-lg'
						src={currentInfo.mediaUrl || ''}
					>
						Votre navigateur ne supporte pas la lecture de vidéos.
					</video>
				</div>
			)
		}
		return null
	}

	// Utiliser directement selectedInformation du store
	const currentInfo = information.selectedInformation

	if (information.isLoading) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='text-center text-fr-grey-dark'>Chargement...</div>
			</div>
		)
	}

	if (!currentInfo) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='text-center text-fr-grey-dark'>Information non trouvée</div>
			</div>
		)
	}

	const currentCategory =
		Array.isArray(currentInfo.categoryId) &&
		currentInfo.categoryId.length > 0 &&
		typeof currentInfo.categoryId[0] === 'object'
			? currentInfo.categoryId[0]
			: null
	const categoryName = currentCategory && 'name' in currentCategory ? currentCategory.name : ''

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Breadcrumb */}
			<nav className='mb-6'>
				<ol className='flex items-center space-x-2 text-sm'>
					<li>
						<button
							onClick={() => navigate('/informations')}
							className='text-fr-blue hover:text-fr-blue-dark'
						>
							Informations
						</button>
					</li>
					{categoryName && (
						<>
							<li className='text-fr-grey-dark'>/</li>
							<li>
								<span className='text-fr-blue'>{categoryName}</span>
							</li>
						</>
					)}
					<li className='text-fr-grey-dark'>/</li>
					<li className='text-fr-grey-dark'>{currentInfo.title}</li>
				</ol>
			</nav>

			{/* Contenu principal */}
			<article className='bg-white rounded-lg shadow-fr-md p-6'>
				<header className='mb-6'>
					<h1 className='text-3xl font-bold text-fr-blue mb-2'>{currentInfo.title}</h1>
					<div className='flex items-center space-x-4 text-fr-grey-dark'>
						<StatusBadge
							status={currentInfo.status as 'DRAFT' | 'PENDING' | 'PUBLISHED'}
						/>
						{categoryName && (
							<span className='text-sm'>Catégorie : {categoryName}</span>
						)}
					</div>
				</header>

				<div className='mb-6'>
					<p className='text-lg text-fr-grey-dark'>
						{currentInfo.descriptionInformation}
					</p>
				</div>

				<div className='mb-8'>{renderContent()}</div>
			</article>
		</div>
	)
}

export default InformationDetailPage
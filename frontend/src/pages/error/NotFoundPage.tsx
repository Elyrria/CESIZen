import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
	const navigate = useNavigate()

	return (
		<div className='min-h-screen bg-fr-grey-light/20 flex flex-col'>
			<div className='flex-1 flex items-center justify-center px-4'>
				<div className='text-center max-w-md'>
					{/* 404 illustration */}
					<div className='mb-8'>
						<div className='text-9xl font-bold text-fr-blue opacity-20'>404</div>
					</div>

					{/* Title and message */}
					<h1 className='text-3xl font-bold text-fr-blue mb-4'>Page non trouvée</h1>
					<p className='text-fr-grey-dark mb-8 leading-relaxed'>
						Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
						Vérifiez l'URL ou retournez à l'accueil.
					</p>

					{/* Actions */}
					<div className='space-y-4'>
						<button
							onClick={() => navigate('/')}
							className='w-full bg-fr-blue text-white px-6 py-3 rounded-md hover:bg-fr-blue/90 transition-colors font-medium'
						>
							Retour à l'accueil
						</button>
						<button
							onClick={() => navigate(-1)}
							className='w-full bg-fr-grey-light text-fr-grey-dark px-6 py-3 rounded-md hover:bg-fr-grey-light/80 transition-colors font-medium'
						>
							Retour à la page précédente
						</button>
					</div>

					{/* Useful links */}
					<div className='mt-8 pt-8 border-t border-fr-grey-light'>
						<p className='text-sm text-fr-grey-dark mb-4'>Pages utiles :</p>
						<div className='flex flex-wrap gap-4 justify-center'>
							<Link
								to='/informations'
								className='text-fr-blue hover:underline text-sm'
							>
								Informations
							</Link>
							<Link
								to='/profile'
								className='text-fr-blue hover:underline text-sm'
							>
								Profil
							</Link>
							<Link
								to='/faq'
								className='text-fr-blue hover:underline text-sm'
							>
								FAQ
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NotFoundPage

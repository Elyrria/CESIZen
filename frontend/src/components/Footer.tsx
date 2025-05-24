// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom'
import React from 'react'

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className='bg-fr-grey-light border-t-4 border-fr-blue mt-auto'>
			<div className='container mx-auto px-fr-4v py-fr-6v'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='space-y-fr-4v'>
						<h4 className='font-bold text-lg text-fr-blue'>CESIZen</h4>
						<p className='text-sm text-fr-grey-dark'>
							L'application de votre santé mentale, proposée par le Ministère
							de la Santé et de la Prévention.
						</p>
					</div>

					<div>
						<h5 className='font-bold mb-fr-4v text-fr-blue'>Liens utiles</h5>
						<ul className='space-y-fr-3v'>
							<li>
								<Link
									to='/'
									className='text-sm text-fr-grey-dark hover:text-fr-blue transition-colors'
								>
									Accueil
								</Link>
							</li>
							<li>
								<Link
									to='/informations'
									className='text-sm text-fr-grey-dark hover:text-fr-blue transition-colors'
								>
									Informations
								</Link>
							</li>
							<li>
								<Link
									to='/activites'
									className='text-sm text-fr-grey-dark hover:text-fr-blue transition-colors'
								>
									Activités
								</Link>
							</li>
							<li>
								<Link
									to='/faq'
									className='text-sm text-fr-grey-dark hover:text-fr-blue transition-colors'
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h5 className='font-bold mb-fr-4v text-fr-blue'>
							Informations légales
						</h5>
						<ul className='space-y-fr-3v'>
							<li>
								<Link
									to='/mentions-legales'
									className='text-sm text-fr-grey-dark hover:text-fr-blue transition-colors'
								>
									Mentions légales
								</Link>
							</li>
							<li>
								<Link
									to='/confidentialite'
									className='text-sm text-fr-grey-dark hover:text-fr-blue transition-colors'
								>
									Politique de confidentialité
								</Link>
							</li>
							<li>
								<Link
									to='/accessibilite'
									className='text-sm text-fr-grey-dark hover:text-fr-blue transition-colors'
								>
									Accessibilité
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-fr-8v pt-fr-6v border-t border-gray-200'>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<div className='text-sm text-fr-grey-dark'>
							© {currentYear} CESIZen - Tous droits réservés
						</div>
						<div className='mt-4 md:mt-0 flex items-center'>
							<img
								src='/logo-republique-francaise.svg'
								alt='République Française'
								className='h-12 mr-4'
								onError={(e) => {
									// Fallback si l'image n'existe pas
									;(e.target as HTMLImageElement).style.display =
										'none'
								}}
							/>
							<img
								src='/logo-ministere-sante.svg'
								alt='Ministère de la Santé et de la Prévention'
								className='h-12'
								onError={(e) => {
									// Fallback si l'image n'existe pas
									;(e.target as HTMLImageElement).style.display =
										'none'
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer

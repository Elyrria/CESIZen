// src/components/layout/Header.tsx
import { Link } from "react-router-dom"
import React, { useState } from "react"
import logo from "@assets/cesizen_logo.svg"

const Header: React.FC = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	// État temporaire pour la démo - à remplacer par un vrai système d'auth
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	return (
		<header className='fr-header shadow-sm'>
			<div className='container mx-auto px-fr-4v'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo et titre */}
					<div className='flex items-center'>
						<Link to='/' className='flex items-center'>
							<img src={logo} alt='CESIZen' className='h-8 w-auto mr-fr-2v' />
							<span className='text-fr-blue font-bold text-xl'>CESIZen</span>
						</Link>
					</div>

					{/* Navigation desktop */}
					<nav className='hidden md:flex space-x-fr-4v'>
						<Link to='/' className='fr-text hover:text-fr-blue transition-colors'>
							Accueil
						</Link>
						<Link
							to='/informations'
							className='fr-text hover:text-fr-blue transition-colors'
						>
							Informations
						</Link>
						<Link
							to='/activités'
							className='fr-text hover:text-fr-blue transition-colors'
						>
							Activités
						</Link>

						{isLoggedIn ? (
							<>
								<Link
									to='/profil'
									className='fr-text hover:text-fr-blue transition-colors'
								>
									Mon profil
								</Link>
								<button
									onClick={() => setIsLoggedIn(false)}
									className='fr-btn fr-btn--secondary fr-btn--sm'
								>
									Déconnexion
								</button>
							</>
						) : (
							<Link to='/login' className='fr-btn fr-btn--primary fr-btn--sm'>
								Connexion
							</Link>
						)}
					</nav>

					{/* Bouton menu mobile */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className='md:hidden text-fr-black p-fr-2v'
						aria-label='Menu'
					>
						<svg
							className='h-6 w-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 6h16M4 12h16M4 18h16'
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Menu mobile */}
			{mobileMenuOpen && (
				<div className='md:hidden bg-white border-t border-gray-200 absolute z-20 w-full'>
					<div className='container mx-auto px-fr-4v py-fr-4v space-y-fr-4v'>
						<Link
							to='/'
							className='block py-fr-2v'
							onClick={() => setMobileMenuOpen(false)}
						>
							Accueil
						</Link>
						<Link
							to='/informations'
							className='block py-fr-2v'
							onClick={() => setMobileMenuOpen(false)}
						>
							Informations
						</Link>
						<Link
							to='/activites'
							className='block py-fr-2v'
							onClick={() => setMobileMenuOpen(false)}
						>
							Activités
						</Link>

						{isLoggedIn ? (
							<>
								<Link
									to='/profil'
									className='block py-fr-2v'
									onClick={() => setMobileMenuOpen(false)}
								>
									Mon profil
								</Link>
								<button
									onClick={() => {
										setIsLoggedIn(false)
										setMobileMenuOpen(false)
									}}
									className='fr-btn fr-btn--secondary w-full'
								>
									Déconnexion
								</button>
							</>
						) : (
							<Link
								to='/login'
								className='fr-btn fr-btn--primary w-full'
								onClick={() => setMobileMenuOpen(false)}
							>
								Connexion
							</Link>
						)}
					</div>
				</div>
			)}

			{/* Navigation bottom mobile */}
			<div className='fr-bottom-nav'>
				<Link to='/' className='fr-bottom-nav__item'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
						/>
					</svg>
					<span className='text-xs'>Accueil</span>
				</Link>
				<Link to='/informations' className='fr-bottom-nav__item'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					<span className='text-xs'>Infos</span>
				</Link>
				<Link to='/exercices' className='fr-bottom-nav__item'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					<span className='text-xs'>Exercices</span>
				</Link>
				<Link to={isLoggedIn ? "/profil" : "/login"} className='fr-bottom-nav__item'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
						/>
					</svg>
					<span className='text-xs'>{isLoggedIn ? "Profil" : "Connexion"}</span>
				</Link>
			</div>
		</header>
	)
}

export default Header

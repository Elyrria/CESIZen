// src/components/layout/Header.tsx
import useAuthStore from "@/stores/useAuthStore"
import logo from "@assets/cesizen_logo.svg"
import React, { useState } from "react"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	// Using the authentication store
	const { user, isAuthenticated, isAdmin, logout } = useAuthStore()

	// Function to handle logout
	const handleLogout = async () => {
		await logout()
		// Close mobile menu after logout
		setMobileMenuOpen(false)
	}

	// Get the first name for personalized display
	const firstName = user?.name || "Utilisateur"

	return (
		<header className='fr-header shadow-sm'>
			<div className='container mx-auto px-fr-4v'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo and title */}
					<div className='flex items-center'>
						<Link to='/' className='flex items-center'>
							<img src={logo} alt='CESIZen' className='h-8 w-auto mr-fr-2v' />
							<span className='text-fr-blue font-bold text-xl'>CESIZen</span>
						</Link>
					</div>

					{/* Desktop navigation */}
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
							to='/activites'
							className='fr-text hover:text-fr-blue transition-colors'
						>
							Activités
						</Link>

						{isAuthenticated ? (
							<>
								<Link
									to='/profil'
									className='fr-text hover:text-fr-blue transition-colors'
								>
									Mon profil
								</Link>

								{/* Link to dashboard for admins */}
								{isAdmin && (
									<Link
										to='/admin'
										className='fr-text text-fr-red hover:text-fr-red-dark transition-colors'
									>
										Tableau de bord
									</Link>
								)}

								<button
									onClick={handleLogout}
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

					{/* Mobile menu button */}
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

			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className='md:hidden bg-white border-t border-gray-200 absolute z-20 w-full'>
					<div className='container mx-auto px-fr-4v py-fr-4v space-y-fr-4v'>
						{/* Section for logged-in user - visible only if authenticated */}
						{isAuthenticated && (
							<div className='py-3 border-b border-gray-100 mb-4'>
								<p className='text-fr-blue font-medium'>
									Hello, {firstName}
								</p>
								<p className='text-sm text-fr-grey-dark'>
									{isAdmin ? "Adminitrateur" : "Utilisateur"}
								</p>
							</div>
						)}

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

						{isAuthenticated ? (
							<>
								<Link
									to='/profil'
									className='block py-fr-2v'
									onClick={() => setMobileMenuOpen(false)}
								>
									Mon profil
								</Link>

								{/* Admin dashboard link in mobile - visible only for admins */}
								{isAdmin && (
									<Link
										to='/admin'
										className='block py-fr-2v text-fr-red'
										onClick={() => setMobileMenuOpen(false)}
									>
										Tableau de bord
									</Link>
								)}

								<button
									onClick={handleLogout}
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

			{/* Mobile bottom navigation */}
			<div className='fr-bottom-nav md:hidden'>
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
				<Link to='/activites' className='fr-bottom-nav__item'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					<span className='text-xs'>Activités</span>
				</Link>

				{isAuthenticated ? (
					// Conditional for the last mobile button
					isAdmin ? (
						// For admins, display a link to the dashboard
						<Link to='/admin' className='fr-bottom-nav__item'>
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
									d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
								/>
							</svg>
							<span className='text-xs'>Admin</span>
						</Link>
					) : (
						// For regular users, display a link to the profile
						<Link to='/profil' className='fr-bottom-nav__item'>
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
									d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
								/>
							</svg>
							<span className='text-xs'>Profil</span>
						</Link>
					)
				) : (
					// For non-logged-in visitors, display a link to login
					<Link to='/login' className='fr-bottom-nav__item'>
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
								d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
							/>
						</svg>
						<span className='text-xs'>Connexion</span>
					</Link>
				)}
			</div>
		</header>
	)
}

export default Header

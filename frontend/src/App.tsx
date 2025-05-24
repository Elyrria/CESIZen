import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import AuthInitializer from '@/components/auth/AuthInitializer'
import Layout from '@/layouts/Layout'

import React, { Suspense, lazy } from 'react'
import ProfilePage from '@/pages/profile/ProfilePage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages d'authentification
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPages'))

// Pages publiques
const HomePage = lazy(() => import('@/pages/home/HomePage'))
const InformationsPage = lazy(() => import('@/pages/information/InformationsPage'))
const InformationDetailPage = lazy(() => import('@/pages/information/InformationDetailPage'))

// Pages admin
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))

const App: React.FC = () => {
	return (
		<Router>
			<AuthInitializer>
				<Layout>
					<Suspense
						fallback={
							<div className='min-h-screen flex items-center justify-center'>
								<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fr-blue'></div>
							</div>
						}
					>
						<Routes>
							{/* Routes publiques */}
							<Route path='/register' element={<RegisterPage />} />
							<Route path='/login' element={<LoginPage />} />
							<Route path='/' element={<HomePage />} />

							{/* Routes des informations */}
							<Route path='/informations' element={<InformationsPage />} />
							<Route
								path='/informations/:id'
								element={<InformationDetailPage />}
							/>

							{/* Routes protégées */}
							<Route
								path='/profile'
								element={
									<ProtectedRoute>
										<ProfilePage />
									</ProtectedRoute>
								}
							/>

							{/* Routes admin */}
							<Route
								path='/admin'
								element={
									<ProtectedRoute requireAdmin={true}>
										<AdminDashboard />
									</ProtectedRoute>
								}
							/>

							{/* Redirection par défaut */}
							<Route path='*' element={<Navigate to='/' replace />} />
						</Routes>
					</Suspense>
				</Layout>
			</AuthInitializer>
		</Router>
	)
}

export default App

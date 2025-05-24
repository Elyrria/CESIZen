import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import AuthInitializer from '@/components/auth/AuthInitializer'
import Layout from '@/layouts/Layout'

import React, { Suspense, lazy } from 'react'
import ProfilePage from '@/pages/profile/ProfilePage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Authentication pages
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPages'))

// Public pages
const HomePage = lazy(() => import('@/pages/home/HomePage'))
const InformationsPage = lazy(() => import('@/pages/information/InformationsPage'))
const InformationDetailPage = lazy(() => import('@/pages/information/InformationDetailPage'))

// Activity pages
const ActivitiesPage = lazy(() => import('@/pages/activity/ActivitiesPage'))
const ActivityDetailPage = lazy(() => import('@/pages/activity/ActivityDetailPage'))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))

// Static pages
const LegalNoticesPage = lazy(() => import('@/pages/legal/LegalNoticesPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'))
const AccessibilityPage = lazy(() => import('@/pages/legal/AccessibilityPage'))
const FAQPage = lazy(() => import('@/pages/help/FAQPage'))

// Error page
const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'))

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
							{/* Public routes */}
							<Route path='/register' element={<RegisterPage />} />
							<Route path='/login' element={<LoginPage />} />
							<Route path='/' element={<HomePage />} />

							{/* Information routes */}
							<Route path='/informations' element={<InformationsPage />} />
							<Route
								path='/informations/:id'
								element={<InformationDetailPage />}
							/>

							{/* Activity routes */}
							<Route path='/activities' element={<ActivitiesPage />} />
							<Route
								path='/activities/:id'
								element={<ActivityDetailPage />}
							/>

							{/* Protected routes */}
							<Route
								path='/profile'
								element={
									<ProtectedRoute>
										<ProfilePage />
									</ProtectedRoute>
								}
							/>

							{/* Admin routes */}
							<Route
								path='/admin'
								element={
									<ProtectedRoute requireAdmin={true}>
										<AdminDashboard />
									</ProtectedRoute>
								}
							/>

							{/* Static pages */}
							<Route
								path='/mentions-legales'
								element={<LegalNoticesPage />}
							/>
							<Route
								path='/confidentialite'
								element={<PrivacyPolicyPage />}
							/>
							<Route path='/accessibilite' element={<AccessibilityPage />} />
							<Route path='/faq' element={<FAQPage />} />

							{/* 404 route - MUST BE LAST */}
							<Route path='*' element={<NotFoundPage />} />
						</Routes>
					</Suspense>
				</Layout>
			</AuthInitializer>
		</Router>
	)
}

export default App

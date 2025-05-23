import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"

import AuthInitializer from "@/components/auth/AuthInitializer"
import Layout from "@/layouts/Layout"

import React, { Suspense, lazy } from "react"

const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"))
const LoginPage = lazy(() => import("@/pages/auth/LoginPages"))
const HomePage = lazy(() => import("@/pages/home/HomePage"))

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

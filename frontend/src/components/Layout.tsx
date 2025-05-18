// src/components/layout/Layout.tsx
import React from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "@components/Header"
import Footer from "@components/Footer"

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className='flex flex-col min-h-screen font-marianne bg-fr-grey-light'>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
			/>

			<Header />
			<main className='flex-grow container mx-auto px-fr-4v py-fr-6v'>{children}</main>
			<Footer />
		</div>
	)
}

export default Layout

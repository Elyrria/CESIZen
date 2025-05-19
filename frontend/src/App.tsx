import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthInitializer from "@/components/auth/AuthInitializer"
import RegisterPage from "./pages/auth/RegisterPage"
import LoginPage from "@pages/auth/LoginPages"
import Layout from "@/components/Layout"

const App: React.FC = () => {
	return (
		<Router>
			<AuthInitializer>
				<Layout>
					<Routes>
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
						{/* Autres routes */}
					</Routes>
				</Layout>
			</AuthInitializer>
		</Router>
	)
}

export default App

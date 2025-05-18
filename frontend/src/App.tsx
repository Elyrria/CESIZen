import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "@pages/auth/LoginPages"
import Layout from "@/components/Layout"

const App: React.FC = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path='/login' element={<LoginPage />} />
				</Routes>
			</Layout>
		</Router>
	)
}

export default App

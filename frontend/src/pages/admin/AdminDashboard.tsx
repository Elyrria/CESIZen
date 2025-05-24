import React, { useState } from 'react'
import UsersTab from './tabs/UsersTab'
import InformationsTab from './tabs/InformationsTab'
import ActivitiesTab from './tabs/ActivitiesTab'
import CategoriesTab from './tabs/CategoriesTab'

type AdminTabId = 'users' | 'informations' | 'activities' | 'categories'

const AdminDashboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState<AdminTabId>('users')

	const renderActiveTabContent = () => {
		switch (activeTab) {
			case 'users':
				return <UsersTab />
			case 'informations':
				return <InformationsTab />
			case 'activities':
				return <ActivitiesTab />
			case 'categories':
				return <CategoriesTab />
			default:
				return <UsersTab />
		}
	}

	const tabs = [
		{ id: 'users', label: 'Utilisateurs' },
		{ id: 'informations', label: 'Informations' },
		{ id: 'activities', label: 'Activités' },
		{ id: 'categories', label: 'Catégories' },
	]

	return (
		<div className='min-h-screen bg-fr-grey-light/20 py-8'>
			<div className='container mx-auto px-4'>
				<h1 className='text-3xl font-bold text-fr-blue mb-8'>Tableau de Bord Administrateur</h1>

				<nav className='flex border-b border-gray-200 mb-6'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
								activeTab === tab.id
									? 'border-fr-blue text-fr-blue bg-white'
									: 'border-transparent text-fr-grey-dark hover:text-fr-blue-dark'
							}`}
							onClick={() => setActiveTab(tab.id as AdminTabId)}
						>
							{tab.label}
						</button>
					))}
				</nav>

				<div>{renderActiveTabContent()}</div>
			</div>
		</div>
	)
}

export default AdminDashboard

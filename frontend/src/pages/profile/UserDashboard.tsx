import React, { useState, useEffect } from 'react'
import TabLayout from '@/components/ui/TabLayout'
import useStore from '@/stores/useStore'
import DraftTab from './tabs/DraftTab'
import PendingTab from './tabs/PendingTab'
import PublishedTab from './tabs/PublishedTab'
import CreateTab from './tabs/CreateTab'

type TabId = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'CREATE'

const UserDashboard: React.FC = () => {
	const { information, auth, category } = useStore()
	const [activeTab, setActiveTab] = useState<TabId>('DRAFT')

	useEffect(() => {
		category.fetchPublicCategories()
	}, []) // Empty dependencies = single call


	useEffect(() => {
		const userId = auth.user?.id
		if (userId && activeTab !== 'CREATE') {
			information.fetchInformations({
				authorId: userId,
				status: activeTab,
			})
		}
	}, [activeTab, auth.user?.id])

	// Count items by status for badges
	const getDraftCount = () => information.informations.filter((i) => i.status === 'DRAFT').length
	const getPendingCount = () => information.informations.filter((i) => i.status === 'PENDING').length
	const getPublishedCount = () => information.informations.filter((i) => i.status === 'PUBLISHED').length

	// Function to change tabs (used by child components)
	const handleTabChange = (tabId: TabId) => {
		setActiveTab(tabId)
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-bold text-fr-blue'>Mes Informations</h2>
				<p className='text-fr-grey-dark'>Gérez vos contenus et publications</p>
			</div>

			<TabLayout
				tabs={[
					{
						id: 'DRAFT',
						label: 'Mes Brouillons',
						badge: getDraftCount(),
						content: <DraftTab onTabChange={handleTabChange} />,
					},
					{
						id: 'PENDING',
						label: 'En Attente',
						badge: getPendingCount(),
						content: <PendingTab />,
					},
					{
						id: 'PUBLISHED',
						label: 'Publiées',
						badge: getPublishedCount(),
						content: <PublishedTab />,
					},
					{
						id: 'CREATE',
						label: 'Créer',
						content: <CreateTab onTabChange={handleTabChange} />,
					},
				]}
				activeTab={activeTab}
				onTabChange={(tabId) => setActiveTab(tabId as TabId)}
			/>
		</div>
	)
}

export default UserDashboard

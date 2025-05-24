import React from 'react'

export interface TabLayoutProps {
	tabs: Array<{
		id: string
		label: string
		content: React.ReactNode
		badge?: number
	}>
	activeTab: string
	onTabChange: (tabId: string) => void
	className?: string
}

const TabLayout: React.FC<TabLayoutProps> = ({ tabs, activeTab, onTabChange, className }) => {
	return (
		<div className={className}>
			<nav className='flex border-b border-gray-200 mb-6' role='tablist'>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						role='tab'
						aria-selected={activeTab === tab.id}
						aria-controls={`tabpanel-${tab.id}`}
						id={`tab-${tab.id}`}
						tabIndex={activeTab === tab.id ? 0 : -1}
						className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors duration-200 focus:outline-none
              ${
			activeTab === tab.id
				? 'border-fr-blue text-fr-blue bg-white'
				: 'border-transparent text-fr-grey-dark hover:text-fr-blue-dark'
		}
            `}
						onClick={() => onTabChange(tab.id)}
						type='button'
					>
						<span>{tab.label}</span>
						{typeof tab.badge === 'number' && (
							<span className='ml-2 inline-block min-w-[1.5em] px-2 py-0.5 text-xs font-semibold bg-fr-blue-light text-fr-blue rounded-full align-middle'>
								{tab.badge}
							</span>
						)}
					</button>
				))}
			</nav>
			{tabs.map((tab) => (
				<div
					key={tab.id}
					id={`tabpanel-${tab.id}`}
					role='tabpanel'
					aria-labelledby={`tab-${tab.id}`}
					hidden={activeTab !== tab.id}
					className={activeTab === tab.id ? 'block' : 'hidden'}
				>
					{tab.content}
				</div>
			))}
		</div>
	)
}

export default TabLayout

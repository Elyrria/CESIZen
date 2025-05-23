import useStore from "@/stores/useStore"
import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { type IInformation, type IActivity } from "@/factories/Factory"

type ItemType = "information" | "activity"

interface LatestItemsProps {
	type: ItemType
	limit?: number
	title?: string
	emptyMessage?: string
	viewAllLink?: string
	viewAllText?: string
}

// Type guards to check the type of the item
function isInformation(item: unknown): item is IInformation {
	return typeof item === "object" && item !== null && "descriptionInformation" in item
}

function isActivity(item: unknown): item is IActivity {
	return typeof item === "object" && item !== null && "descriptionActivity" in item
}

const LatestItems: React.FC<LatestItemsProps> = ({
	type,
	limit = 3,
	title = type === "information" ? "Latest Articles" : "Latest Activities",
	emptyMessage = type === "information" ? "No articles available" : "No activities available",
	viewAllLink = type === "information" ? "/informations" : "/activities",
	viewAllText = type === "information" ? "View all articles →" : "View all activities →",
}) => {
	// Use the root store to access the appropriate store
	const store = useStore()

	// Use the correct store based on the type
	const { fetchPublicInformations, informations, isLoading: infoLoading, error: infoError } = store.information

	const { fetchPublicActivities, activities, isLoading: activityLoading, error: activityError } = store.activity

	// Determine the correct values based on the type
	const items = type === "information" ? informations : activities
	const isLoading = type === "information" ? infoLoading : activityLoading
	const error = type === "information" ? infoError : activityError

	useEffect(() => {
		// Fetch the appropriate items when the component mounts
		if (type === "information") {
			fetchPublicInformations({
				limit,
				sortBy: "createdAt",
				order: "desc",
			})
		} else {
			fetchPublicActivities({
				limit,
				sortBy: "createdAt",
				order: "desc",
			})
		}
	}, [type, limit, fetchPublicInformations, fetchPublicActivities])

	return (
		<div className='p-4 bg-fr-grey-light/10 rounded-lg'>
			<h4 className='font-semibold mb-2'>{title}</h4>

			{isLoading ? (
				<div className='text-center py-2'>
					<p className='text-fr-grey-dark text-sm'>Loading...</p>
				</div>
			) : error ? (
				<div className='text-center py-2'>
					<p className='text-red-500 text-sm'>Unable to load data</p>
				</div>
			) : items && items.length > 0 ? (
				<div className='space-y-2'>
					{items.slice(0, limit).map((item) => (
						<Link
							to={`/${
								type === "information" ? "informations" : "activities"
							}/${item.id}`}
							key={item.id}
							className='block hover:bg-fr-grey-light/20 p-2 rounded transition-colors'
						>
							<p className='text-fr-grey-dark text-sm font-medium'>
								• {item.name}
							</p>
							{isInformation(item) && item.descriptionInformation && (
								<p className='text-fr-grey text-xs ml-3 mt-1 line-clamp-2'>
									{item.descriptionInformation}
								</p>
							)}
							{isActivity(item) && item.descriptionActivity && (
								<p className='text-fr-grey text-xs ml-3 mt-1 line-clamp-2'>
									{item.descriptionActivity}
								</p>
							)}
						</Link>
					))}
				</div>
			) : (
				<div className='text-center py-2'>
					<p className='text-fr-grey-dark text-sm'>{emptyMessage}</p>
				</div>
			)}

			<Link to={viewAllLink} className='inline-block mt-4 text-fr-blue hover:underline'>
				{viewAllText}
			</Link>
		</div>
	)
}

export default LatestItems

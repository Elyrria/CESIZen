import useStore from "@/stores/useStore"
import React, { useEffect } from "react"
import { Link } from "react-router-dom"

interface LatestInformationsProps {
	limit?: number
}

const LatestInformations: React.FC<LatestInformationsProps> = ({ limit = 3 }) => {
	// Use the root store to access the information store
	const { information } = useStore()
	const { informations, fetchPublicInformations, isLoading, error } = information

	useEffect(() => {
		// Fetch latest public informations when component mounts
		fetchPublicInformations({
			limit,
			sortBy: "createdAt",
			order: "desc",
		})
	}, [fetchPublicInformations, limit])

	return (
		<div className='p-4 bg-fr-grey-light/10 rounded-lg'>
			<h4 className='font-semibold mb-2'>Latest Information</h4>

			{isLoading ? (
				<div className='text-center py-2'>
					<p className='text-fr-grey-dark text-sm'>Loading...</p>
				</div>
			) : error ? (
				<div className='text-center py-2'>
					<p className='text-red-500 text-sm'>Unable to load information</p>
				</div>
			) : informations && informations.length > 0 ? (
				<div className='space-y-2'>
					{informations.slice(0, limit).map((info) => (
						<Link
							to={`/informations/${info.id}`}
							key={info.id}
							className='block hover:bg-fr-grey-light/20 p-2 rounded transition-colors'
						>
							<p className='text-fr-grey-dark text-sm font-medium'>
								• {info.title}
							</p>
							{info.descriptionInformation && (
								<p className='text-fr-grey text-xs ml-3 mt-1 line-clamp-2'>
									{info.descriptionInformation}
								</p>
							)}
						</Link>
					))}
				</div>
			) : (
				<div className='text-center py-2'>
					<p className='text-fr-grey-dark text-sm'>No information available</p>
				</div>
			)}

			<Link to='/informations' className='inline-block mt-4 text-fr-blue hover:underline'>
				View all information →
			</Link>
		</div>
	)
}

export default LatestInformations

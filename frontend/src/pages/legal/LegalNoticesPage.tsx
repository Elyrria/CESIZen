import React from 'react'

const LegalNoticesPage: React.FC = () => {
	return (
		<div className='min-h-screen bg-fr-grey-light/20 py-8'>
			<div className='container mx-auto px-4 max-w-4xl'>
				<div className='bg-white rounded-lg shadow-fr-md p-8'>
					<h1 className='text-3xl font-bold text-fr-blue mb-8'>Mentions Légales</h1>

					<div className='prose prose-blue max-w-none'>
						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Éditeur du site
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Sed do eiusmod tempor incididunt ut labore et dolore
								magna aliqua. Ut enim ad minim veniam, quis nostrud
								exercitation ullamco laboris nisi ut aliquip ex ea
								commodo consequat.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Duis aute irure dolor in reprehenderit in voluptate
								velit esse cillum dolore eu fugiat nulla pariatur.
								Excepteur sint occaecat cupidatat non proident, sunt in
								culpa qui officia deserunt mollit anim id est laborum.
							</p>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Responsable de la publication
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Sed ut perspiciatis unde omnis iste natus error sit
								voluptatem accusantium doloremque laudantium, totam rem
								aperiam, eaque ipsa quae ab illo inventore veritatis et
								quasi architecto beatae vitae dicta sunt explicabo.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Nemo enim ipsam voluptatem quia voluptas sit aspernatur
								aut odit aut fugit, sed quia consequuntur magni dolores
								eos qui ratione voluptatem sequi nesciunt.
							</p>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Hébergement
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Neque porro quisquam est, qui dolorem ipsum quia dolor
								sit amet, consectetur, adipisci velit, sed quia non
								numquam eius modi tempora incidunt ut labore et dolore
								magnam aliquam quaerat voluptatem.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Ut enim ad minima veniam, quis nostrum exercitationem
								ullam corporis suscipit laboriosam, nisi ut aliquid ex
								ea commodi consequatur.
							</p>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Propriété intellectuelle
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Quis autem vel eum iure reprehenderit qui in ea
								voluptate velit esse quam nihil molestiae consequatur,
								vel illum qui dolorem eum fugiat quo voluptas nulla
								pariatur.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								At vero eos et accusamus et iusto odio dignissimos
								ducimus qui blanditiis praesentium voluptatum deleniti
								atque corrupti quos dolores et quas molestias excepturi
								sint occaecati cupiditate non provident.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Contact
							</h2>
							<p className='text-fr-grey-dark leading-relaxed'>
								Similique sunt in culpa qui officia deserunt mollitia
								animi, id est laborum et dolorum fuga. Et harum quidem
								rerum facilis est et expedita distinctio. Nam libero
								tempore, cum soluta nobis est eligendi optio cumque
								nihil impedit quo minus id quod maxime placeat facere
								possimus.
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LegalNoticesPage

import React from 'react'

const PrivacyPolicyPage: React.FC = () => {
	return (
		<div className='min-h-screen bg-fr-grey-light/20 py-8'>
			<div className='container mx-auto px-4 max-w-4xl'>
				<div className='bg-white rounded-lg shadow-fr-md p-8'>
					<h1 className='text-3xl font-bold text-fr-blue mb-8'>
						Privacy Policy
					</h1>

					<div className='prose prose-blue max-w-none'>
						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Personal Data Collection
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Maecenas sed diam eget risus varius blandit sit amet non
								magna. Cras mattis consectetur purus sit amet fermentum.
								Donec id elit non mi porta gravida at eget metus.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Nullam quis risus eget urna mollis ornare vel eu leo.
								Cum sociis natoque penatibus et magnis dis parturient
								montes, nascetur ridiculus mus.
							</p>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Data Usage
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Vestibulum id ligula porta felis euismod semper.
								Praesent commodo cursus magna, vel scelerisque nisl
								consectetur et. Morbi leo risus, porta ac consectetur
								ac, vestibulum at eros.
							</p>
							<ul className='list-disc list-inside text-fr-grey-dark space-y-2 mb-4'>
								<li>Lorem ipsum dolor sit amet consectetur</li>
								<li>Adipiscing elit sed do eiusmod tempor</li>
								<li>Incididunt ut labore et dolore magna</li>
								<li>Aliqua ut enim ad minim veniam</li>
							</ul>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Cookies and Similar Technologies
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Etiam porta sem malesuada magna mollis euismod. Donec
								sed odio dui. Integer posuere erat a ante venenatis
								dapibus posuere velit aliquet.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Sed posuere consectetur est at lobortis. Aenean lacinia
								bibendum nulla sed consectetur. Vivamus sagittis lacus
								vel augue laoreet rutrum faucibus dolor auctor.
							</p>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								GDPR Rights
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Conformément au Règlement Général sur la Protection des
								Données (RGPD), vous disposez des droits suivants :
							</p>
							<ul className='list-disc list-inside text-fr-grey-dark space-y-2 mb-4'>
								<li>Droit d'accès à vos données personnelles</li>
								<li>Droit de rectification de vos données</li>
								<li>Droit à l'effacement de vos données</li>
								<li>Droit à la limitation du traitement</li>
								<li>Droit à la portabilité des données</li>
								<li>Droit d'opposition</li>
							</ul>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Contact
							</h2>
							<p className='text-fr-grey-dark leading-relaxed'>
								Pour exercer vos droits ou pour toute question relative
								à cette politique de confidentialité, vous pouvez nous
								contacter à l'adresse suivante :
								<a
									href='mailto:contact@cesizen.fr'
									className='text-fr-blue hover:underline ml-1'
								>
									contact@cesizen.fr
								</a>
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PrivacyPolicyPage

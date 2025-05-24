import React from 'react'

const AccessibilityPage: React.FC = () => {
	return (
		<div className='min-h-screen bg-fr-grey-light/20 py-8'>
			<div className='container mx-auto px-4 max-w-4xl'>
				<div className='bg-white rounded-lg shadow-fr-md p-8'>
					<h1 className='text-3xl font-bold text-fr-blue mb-8'>Accessibilité</h1>

					<div className='prose prose-blue max-w-none'>
						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Déclaration d'accessibilité
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Suspendisse varius enim in eros elementum tristique.
								Duis cursus, mi quis viverra ornare, eros dolor interdum
								nulla, ut commodo diam libero vitae erat.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Aenean faucibus nibh et justo cursus id rutrum lorem
								imperdiet. Nunc ut sem vitae risus tristique posuere.
							</p>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Technologies utilisées
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								L'accessibilité de ce site s'appuie sur les technologies
								suivantes :
							</p>
							<ul className='list-disc list-inside text-fr-grey-dark space-y-2 mb-4'>
								<li>HTML sémantique</li>
								<li>CSS pour la mise en forme</li>
								<li>JavaScript pour les interactions</li>
								<li>ARIA pour l'accessibilité</li>
							</ul>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								État de conformité
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Fusce dapibus, tellus ac cursus commodo, tortor mauris
								condimentum nibh, ut fermentum massa justo sit amet
								risus. Maecenas faucibus mollis interdum.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Cras justo odio, dapibus ac facilisis in, egestas eget
								quam. Nullam quis risus eget urna mollis ornare vel eu
								leo.
							</p>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Contenus non accessibles
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Les contenus listés ci-dessous ne sont pas accessibles
								pour les raisons suivantes :
							</p>
							<ul className='list-disc list-inside text-fr-grey-dark space-y-2 mb-4'>
								<li>
									Non-conformité avec le RGAA : Lorem ipsum dolor
									sit amet
								</li>
								<li>
									Charge disproportionnée : Consectetur adipiscing
									elit
								</li>
								<li>
									Contenu tiers : Sed do eiusmod tempor incididunt
								</li>
							</ul>
						</section>

						<section className='mb-8'>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Amélioration et contact
							</h2>
							<p className='text-fr-grey-dark leading-relaxed mb-4'>
								Si vous n'arrivez pas à accéder à un contenu ou à un
								service, vous pouvez nous contacter pour être orienté
								vers une alternative accessible ou obtenir le contenu
								sous une autre forme.
							</p>
							<p className='text-fr-grey-dark leading-relaxed'>
								Envoyer un message :
								<a
									href='mailto:accessibilite@cesizen.fr'
									className='text-fr-blue hover:underline ml-1'
								>
									accessibilite@cesizen.fr
								</a>
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-fr-blue mb-4'>
								Voie de recours
							</h2>
							<p className='text-fr-grey-dark leading-relaxed'>
								Cette procédure est à utiliser dans le cas suivant :
								vous avez signalé au responsable du site internet un
								défaut d'accessibilité qui vous empêche d'accéder à un
								contenu ou à l'un des services du portail et vous n'avez
								pas obtenu de réponse satisfaisante.
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AccessibilityPage

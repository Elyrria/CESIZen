import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQPage: React.FC = () => {
	const [openItems, setOpenItems] = useState<Set<number>>(new Set())

	const toggleItem = (index: number) => {
		const newOpenItems = new Set(openItems)
		if (newOpenItems.has(index)) {
			newOpenItems.delete(index)
		} else {
			newOpenItems.add(index)
		}
		setOpenItems(newOpenItems)
	}

	const faqData = [
		{
			question: "Qu'est-ce que CESIZen ?",
			answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
		{
			question: "Comment créer un compte ?",
			answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		},
		{
			question: "Comment utiliser les exercices de respiration ?",
			answer: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
		},
		{
			question: "Mes données sont-elles sécurisées ?",
			answer: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
		},
		{
			question: "Comment contacter l'équipe de support ?",
			answer: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."
		}
	]

	return (
		<div className="min-h-screen bg-fr-grey-light/20 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="bg-white rounded-lg shadow-fr-md p-8">
					<h1 className="text-3xl font-bold text-fr-blue mb-8">Foire Aux Questions (FAQ)</h1>
					
					<div className="space-y-4">
						{faqData.map((item, index) => (
							<div 
								key={index}
								className="border border-fr-grey-light rounded-lg overflow-hidden"
							>
								<button
									onClick={() => toggleItem(index)}
									className="w-full px-6 py-4 text-left bg-fr-grey-light/10 hover:bg-fr-grey-light/20 focus:outline-none focus:ring-2 focus:ring-fr-blue transition-colors"
									aria-expanded={openItems.has(index)}
									aria-controls={`faq-content-${index}`}
								>
									<div className="flex justify-between items-center">
										<h3 className="text-lg font-semibold text-fr-blue">
											{item.question}
										</h3>
										<svg 
											className={`w-5 h-5 text-fr-blue transform transition-transform ${
												openItems.has(index) ? 'rotate-180' : ''
											}`}
											fill="none" 
											stroke="currentColor" 
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path 
												strokeLinecap="round" 
												strokeLinejoin="round" 
												strokeWidth={2} 
												d="M19 9l-7 7-7-7" 
											/>
										</svg>
									</div>
								</button>
								
								{openItems.has(index) && (
									<div 
										id={`faq-content-${index}`}
										className="px-6 py-4 bg-white border-t border-fr-grey-light"
									>
										<p className="text-fr-grey-dark leading-relaxed">
											{item.answer}
										</p>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Contact section */}
					<div className="mt-12 p-6 bg-fr-blue/5 rounded-lg border border-fr-blue/10">
						<h2 className="text-xl font-semibold text-fr-blue mb-4">
							Vous ne trouvez pas votre réponse ?
						</h2>
						<p className="text-fr-grey-dark mb-4">
							Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute 
							question supplémentaire.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<a 
								href="mailto:support@cesizen.fr"
								className="bg-fr-blue text-white px-6 py-3 rounded-md hover:bg-fr-blue/90 transition-colors font-medium text-center"
							>
								Nous contacter par email
							</a>
							<Link 
								to="/profile"
								className="bg-fr-grey-light text-fr-grey-dark px-6 py-3 rounded-md hover:bg-fr-grey-light/80 transition-colors font-medium text-center"
							>
								Accéder au profil
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FAQPage

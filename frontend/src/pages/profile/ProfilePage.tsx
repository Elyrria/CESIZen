import React, { useState } from 'react'
import TabLayout from '@/components/ui/TabLayout'
import UserDashboard from './UserDashboard'
import useStore from '@/stores/useStore'
import Button from '@/components/ui/Button'

// Définir EditableField ici pour éviter l'import circulaire
export type EditableField = 'name' | 'firstName' | 'email' | 'birthDate' | 'password'

// Composant résumé profil avec boutons Modifier
interface ProfileSummaryProps {
	onEditField: (field: EditableField) => void
}
const ProfileSummary: React.FC<ProfileSummaryProps> = ({ onEditField }) => {
	const { auth } = useStore()
	const user = auth.user
	if (!user) return null
	return (
		<div className='max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 border border-fr-grey-light'>
			<h2 className='text-2xl font-bold text-fr-blue mb-6 text-center'>Mon profil</h2>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<div className='text-sm text-fr-grey-dark'>Nom</div>
						<div className='font-medium text-fr-blue text-lg'>{user.name}</div>
					</div>
					<Button onClick={() => onEditField('name')}>Modifier</Button>
				</div>
				<div className='flex items-center justify-between'>
					<div>
						<div className='text-sm text-fr-grey-dark'>Prénom</div>
						<div className='font-medium text-fr-blue text-lg'>{user.firstName}</div>
					</div>
					<Button onClick={() => onEditField('firstName')}>Modifier</Button>
				</div>
				<div className='flex items-center justify-between'>
					<div>
						<div className='text-sm text-fr-grey-dark'>Email</div>
						<div className='font-medium text-fr-blue text-lg'>{user.email}</div>
					</div>
					<Button onClick={() => onEditField('email')}>Modifier</Button>
				</div>
				<div className='flex items-center justify-between'>
					<div>
						<div className='text-sm text-fr-grey-dark'>Date de naissance</div>
						<div className='font-medium text-fr-blue text-lg'>{user.birthDate}</div>
					</div>
					<Button onClick={() => onEditField('birthDate')}>Modifier</Button>
				</div>
				<div className='flex items-center justify-between'>
					<div>
						<div className='text-sm text-fr-grey-dark'>Mot de passe</div>
						<div className='font-medium text-fr-blue text-lg'>••••••••</div>
					</div>
					<Button onClick={() => onEditField('password')}>Modifier</Button>
				</div>
			</div>
		</div>
	)
}

const fieldLabels: Record<EditableField, string> = {
	name: 'Nom',
	firstName: 'Prénom',
	email: 'Email',
	birthDate: 'Date de naissance',
	password: 'Mot de passe',
}

const ProfilePage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'personal' | 'dashboard'>('personal')
	const [editField, setEditField] = useState<EditableField | null>(null)
	const { user, auth } = useStore()

	const currentUser = auth.user
	const [value, setValue] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')

	React.useEffect(() => {
		if (editField && currentUser) {
			if (editField === 'password') {
				setCurrentPassword('')
				setNewPassword('')
			} else {
				setValue(String(currentUser[editField as keyof typeof currentUser] ?? ''))
			}
			setError(null)
		}
	}, [editField, currentUser])

	const handleSave = async () => {
		if (!editField || !currentUser) return
		setIsSubmitting(true)
		setError(null)
		try {
			if (editField === 'password') {
				if (!currentPassword || !newPassword) {
					setError('Les deux champs sont requis')
					setIsSubmitting(false)
					return
				}
				if (newPassword.length < 8) {
					setError('Le nouveau mot de passe doit contenir au moins 8 caractères')
					setIsSubmitting(false)
					return
				}
				const updateSuccess = await user.updateUser(currentUser.id, {
					password: currentPassword,
					newPassword: newPassword,
				})
				if (updateSuccess) {
					await auth.fetchUserProfile()
					setEditField(null)
					setCurrentPassword('')
					setNewPassword('')
				} else {
					setError('Erreur lors de la mise à jour')
				}
				setIsSubmitting(false)
				return
			}

			if (!value.trim()) {
				setError('Ce champ est requis')
				setIsSubmitting(false)
				return
			}

			const updateSuccess = await user.updateUser(currentUser.id, { [editField]: value })

			if (updateSuccess) {
				await auth.fetchUserProfile()
				setEditField(null)
			} else {
				setError('Erreur lors de la mise à jour')
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour:', error)
			setError('Erreur lors de la mise à jour')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!currentUser) return null

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold text-fr-blue mb-6'>Mon profil</h1>
			<TabLayout
				tabs={[
					{
						id: 'personal',
						label: 'Informations personnelles',
						content: editField ? (
							<div className='max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 border border-fr-grey-light'>
								<h2 className='text-2xl font-bold text-fr-blue mb-6 text-center'>
									Modifier {fieldLabels[editField]}
								</h2>
								<div className='mb-4'>
									{editField === 'password' ? (
										<div>
											<label className='block font-medium mb-1'>
												Ancien mot de passe
											</label>
											<input
												type='password'
												value={currentPassword}
												onChange={(e) =>
													setCurrentPassword(
														e.target
															.value
													)
												}
												className='w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 font-sans focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue mb-2'
												placeholder='Votre mot de passe actuel'
											/>
											<label className='block font-medium mb-1 mt-2'>
												Nouveau mot de passe
											</label>
											<input
												type='password'
												value={newPassword}
												onChange={(e) =>
													setNewPassword(
														e.target
															.value
													)
												}
												className='w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 font-sans focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue'
												placeholder='Nouveau mot de passe'
											/>
											{error && (
												<p className='text-red-600 text-sm mt-1'>
													{error}
												</p>
											)}
										</div>
									) : (
										<div>
											<label className='block font-medium mb-1'>
												{fieldLabels[editField]}
											</label>
											<input
												type={
													editField ===
													'birthDate'
														? 'date'
														: 'text'
												}
												value={value}
												onChange={(e) =>
													setValue(
														e.target
															.value
													)
												}
												className='w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 font-sans focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue'
											/>
											{error && (
												<p className='text-red-600 text-sm mt-1'>
													{error}
												</p>
											)}
										</div>
									)}
								</div>
								<div className='flex space-x-2 justify-end'>
									<Button
										type='button'
										onClick={() => {
											setEditField(null)
											setCurrentPassword('')
											setNewPassword('')
											setValue('')
											setError(null)
										}}
									>
										Annuler
									</Button>
									<Button
										type='button'
										onClick={handleSave}
										disabled={isSubmitting}
									>
										{isSubmitting
											? 'Enregistrement...'
											: 'Enregistrer'}
									</Button>
								</div>
							</div>
						) : (
							<ProfileSummary onEditField={setEditField} />
						),
					},
					{
						id: 'dashboard',
						label: 'Mes informations',
						content: <UserDashboard />,
					},
				]}
				activeTab={activeTab}
				onTabChange={(tabId: string) => setActiveTab(tabId as 'personal' | 'dashboard')}
			/>
		</div>
	)
}

export default ProfilePage

# Documentation des Tests de Validation Utilisateur

## Aperçu

Cette suite de tests unitaires vérifie que les règles de validation pour la création d'utilisateur fonctionnent correctement et détectent les données invalides. Ces tests isolent les validateurs pour s'assurer qu'ils fonctionnent indépendamment des autres composants du système.

## Objectif des Tests

Ces tests unitaires servent à :

- Vérifier que les validateurs acceptent les données valides
- S'assurer que les validateurs rejettent correctement les données invalides
- Tester tous les cas d'erreur potentiels individuellement
- Garantir la robustesse de la validation sans dépendre de l'état de la base de données

## Cas de Test

### TC-001 : Validation de Données Utilisateur Valides

- **ID** : VT-001-01
- **Description** : Vérifie que les données utilisateur valides passent la validation
- **Entrée** : Données utilisateur complètes et valides
- **Sortie Attendue** : Aucune erreur de validation
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Validation d'un Email Invalide

- **ID** : VT-001-02
- **Description** : Vérifie que le validateur rejette un email mal formaté
- **Entrée** : Données utilisateur avec un email invalide
- **Sortie Attendue** : Erreur de validation pour le champ email
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Validation d'un Mot de Passe Trop Court

- **ID** : VT-001-03
- **Description** : Vérifie que le validateur rejette un mot de passe trop court
- **Entrée** : Données utilisateur avec un mot de passe court
- **Sortie Attendue** : Erreur de validation concernant la longueur du mot de passe
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Validation d'un Mot de Passe Sans Caractères Spéciaux

- **ID** : VT-001-04
- **Description** : Vérifie que le validateur rejette un mot de passe sans caractères spéciaux
- **Entrée** : Données utilisateur avec un mot de passe sans caractères spéciaux
- **Sortie Attendue** : Erreur de validation concernant les exigences du mot de passe
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-005 : Validation d'un Nom Trop Long

- **ID** : VT-001-05
- **Description** : Vérifie que le validateur rejette un nom dépassant la longueur maximale
- **Entrée** : Données utilisateur avec un nom trop long
- **Sortie Attendue** : Erreur de validation concernant la longueur du nom
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Validation d'une Date de Naissance dans le Futur

- **ID** : VT-001-06
- **Description** : Vérifie que le validateur rejette une date de naissance future
- **Entrée** : Données utilisateur avec une date de naissance dans le futur
- **Sortie Attendue** : Erreur de validation concernant la date
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-007 : Validation d'un Utilisateur Trop Jeune

- **ID** : VT-001-07
- **Description** : Vérifie que le validateur rejette une date de naissance correspondant à un âge inférieur au minimum
- **Entrée** : Données utilisateur avec une date de naissance trop récente
- **Sortie Attendue** : Erreur de validation concernant l'âge minimum
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-008 : Validation d'un Rôle Non Autorisé

- **ID** : VT-001-08
- **Description** : Vérifie que le validateur rejette un rôle non autorisé pour la création
- **Entrée** : Données utilisateur avec un rôle administrateur
- **Sortie Attendue** : Erreur de validation concernant le rôle
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-009 : Validation avec Champs Manquants

- **ID** : VT-001-09
- **Description** : Vérifie que le validateur rejette une requête avec un champ obligatoire manquant
- **Entrée** : Données utilisateur sans le champ email
- **Sortie Attendue** : Erreur de validation indiquant que l'email est requis
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Méthodologie

Ces tests utilisent une approche isolée :

- Ils testent directement les règles de validation sans passer par le contrôleur
- Ils simulent l'environnement Express Request/Response
- Ils exécutent les validations de manière asynchrone pour assurer leur résolution complète
- Ils vérifient la présence et le type des erreurs de validation

## Points techniques importants

- Les validations sont exécutées de manière asynchrone avec `await Promise.resolve(rule(req, res, next))`
- L'interface `ValidationErrorWithPath` est utilisée pour typer correctement les erreurs de validation
- Les erreurs sont vérifiées en utilisant les constantes de champ (`FIELD`) pour garantir la cohérence
- Utilisation des assertions pour vérifier à la fois la présence d'erreurs et leur contenu

## Avantages de cette approche de test

1. **Test isolé** : Les validateurs sont testés indépendamment des autres composants de l'application
2. **Rapidité** : Les tests ne nécessitent pas de connexion à la base de données ou d'autres services externes
3. **Fiabilité** : Les tests sont déterministes et ne sont pas affectés par l'état de l'application
4. **Couverture complète** : Chaque règle de validation est testée individuellement
5. **Maintenabilité** : Les tests sont clairs, simples et faciles à maintenir

## Remarque technique

Pour garantir le bon fonctionnement des tests asynchrones, les validations sont exécutées avec `await Promise.resolve()` pour s'assurer que toutes les validations asynchrones sont complètes avant de vérifier les résultats. Cette technique est essentielle lorsqu'on teste des validateurs express-validator, qui sont souvent asynchrones.

## Implémentation des Tests

```typescript
import { createUserValidationRules } from "@validator/user.validator.ts"
import { CONFIG_FIELD, FIELD } from "@configs/fields.configs.ts"
import { validationResult } from "express-validator"
import { ROLES } from "@configs/role.configs.ts"
interface ValidationErrorWithPath {
	type: string
	value: any
	msg: string
	path: string
	location: string
}

describe("User Validation Rules", () => {
	// Use any to avoid typing issues
	const runValidation = async (body: any) => {
		const req: any = { body }
		const res: any = {}
		const next = jest.fn()

		// Execute each validation rule
		for (const rule of createUserValidationRules) {
			await Promise.resolve(rule(req, res, next))
		}

		return validationResult(req)
	}

	// Valid user data for tests
	const validUserData = {
		email: "test@example.com",
		password: "Password123!",
		name: "Doe",
		firstName: "John",
		birthDate: "1990-01-01", // ISO8601 format
		role: ROLES.REGISTERED_USER,
	}

	it("should pass validation with valid user data", async () => {
		const result = await runValidation(validUserData)
		expect(result.isEmpty()).toBe(true)
	})

	it("should fail validation with invalid email", async () => {
		const result = await runValidation({
			...validUserData,
			email: "invalid-email",
		})

		expect(result.isEmpty()).toBe(false)

		const errors = result.array() as unknown as ValidationErrorWithPath[]
		// Verify that the error is related to the email
		const emailError = errors.find((error) => error.path === FIELD.EMAIL)
		expect(emailError).toBeDefined()
		expect(emailError?.msg).toContain(FIELD.EMAIL)
	})

	it("should fail validation with password too short", async () => {
		const result = await runValidation({
			...validUserData,
			password: "Ps1!", // Too short
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const passwordError = errors.find((error) => error.path === FIELD.PASSWORD)
		expect(passwordError).toBeDefined()
	})

	it("should fail validation with password without special characters", async () => {
		const result = await runValidation({
			...validUserData,
			password: "Password123", // Without special character
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const passwordError = errors.find((error) => error.path === FIELD.PASSWORD)
		expect(passwordError).toBeDefined()
	})

	it("should fail validation with name too long", async () => {
		const result = await runValidation({
			...validUserData,
			name: "A".repeat(CONFIG_FIELD.LENGTH.NAME.MAX + 1),
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const nameError = errors.find((error) => error.path === FIELD.NAME)
		expect(nameError).toBeDefined()
	})

	it("should fail validation with birth date in the future", async () => {
		const futureDate = new Date()
		futureDate.setFullYear(futureDate.getFullYear() + 1)

		const result = await runValidation({
			...validUserData,
			birthDate: futureDate.toISOString().split("T")[0], // ISO8601 format (YYYY-MM-DD)
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const birthDateError = errors.find((error) => error.path === FIELD.BIRTH_DATE)
		expect(birthDateError).toBeDefined()
	})

	it("should fail validation with user too young", async () => {
		const tooYoungDate = new Date()
		tooYoungDate.setFullYear(tooYoungDate.getFullYear() - CONFIG_FIELD.MIN_AGE + 1)

		const result = await runValidation({
			...validUserData,
			birthDate: tooYoungDate.toISOString().split("T")[0],
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const birthDateError = errors.find((error) => error.path === FIELD.BIRTH_DATE)
		expect(birthDateError).toBeDefined()
	})

	it("should fail validation with unauthorized role", async () => {
		const result = await runValidation({
			...validUserData,
			role: ROLES.ADMIN, // Unauthorized role for creation
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const roleError = errors.find((error) => error.path === FIELD.ROLE)
		expect(roleError).toBeDefined()
	})

	it("should fail validation for missing required fields", async () => {
		// Create an object without email
		const { email, ...missingEmailData } = validUserData

		const result = await runValidation(missingEmailData)

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const emailError = errors.find((error) => error.path === FIELD.EMAIL)
		expect(emailError).toBeDefined()
	})
})
```

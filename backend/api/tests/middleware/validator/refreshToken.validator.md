# Documentation des Tests de Validation RefreshToken

## Aperçu

Cette suite de tests unitaires vérifie que les règles de validation pour la création de jetons de rafraîchissement fonctionnent correctement et détectent les données invalides. Ces tests isolent les validateurs pour s'assurer qu'ils fonctionnent indépendamment des autres composants du système.

## Objectif des Tests

Ces tests unitaires servent à :

- Vérifier que les validateurs acceptent les données valides pour les refreshToken
- S'assurer que les validateurs rejettent correctement les données invalides
- Tester tous les cas d'erreur potentiels individuellement
- Garantir la robustesse de la validation sans dépendre de l'état de la base de données

## Cas de Test

### TC-001 : Validation de Données RefreshToken Valides

- **ID** : VT-002-01
- **Description** : Vérifie que les données refreshToken valides passent la validation
- **Entrée** : Données refreshToken complètes et valides
- **Sortie Attendue** : Aucune erreur de validation
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Validation d'un refreshToken manquant

- **ID** : VT-002-02
- **Description** : Vérifie que le validateur rejette une requête avec un champ refreshToken manquant
- **Entrée** : Données refreshToken sans le champ refreshToken
- **Sortie Attendue** : Erreur de validation indiquant que le refreshToken est requis
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Validation d'un refreshToken non-string

- **ID** : VT-002-03
- **Description** : Vérifie que le validateur rejette un refreshToken qui n'est pas une chaîne de caractères
- **Entrée** : Données refreshToken avec un refreshToken non-string
- **Sortie Attendue** : Erreur de validation indiquant que le refreshToken doit être une chaîne
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Validation d'un userId manquant

- **ID** : VT-002-04
- **Description** : Vérifie que le validateur rejette une requête avec un champ userId manquant
- **Entrée** : Données refreshToken sans le champ userId
- **Sortie Attendue** : Erreur de validation indiquant que le userId est requis
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-005 : Validation d'un userId non-string

- **ID** : VT-002-05
- **Description** : Vérifie que le validateur rejette un userId qui n'est pas une chaîne de caractères
- **Entrée** : Données refreshToken avec un userId non-string
- **Sortie Attendue** : Erreur de validation indiquant que le userId doit être une chaîne
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Validation d'un userId avec format ObjectId invalide

- **ID** : VT-002-06
- **Description** : Vérifie que le validateur rejette un userId avec un format ObjectId invalide
- **Entrée** : Données refreshToken avec un userId au format ObjectId invalide
- **Sortie Attendue** : Erreur de validation concernant le format du userId
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

## Implémentation des Tests

```typescript
import { createRefreshTokenValidationRules } from "@validator/refreshToken.validator.ts"
import { FIELD } from "@configs/fields.configs.ts"
import { validationResult } from "express-validator"
import { Types } from "mongoose"

interface ValidationErrorWithPath {
	type: string
	value: any
	msg: string
	path: string
	location: string
}

describe("RefreshToken Validation Rules", () => {
	// Use any to avoid typing issues
	const runValidation = async (body: any) => {
		const req: any = { body }
		const res: any = {}
		const next = jest.fn()

		// Execute each validation rule
		for (const rule of createRefreshTokenValidationRules) {
			await Promise.resolve(rule(req, res, next))
		}

		return validationResult(req)
	}

	// Valid refreshToken data for tests
	const validRefreshTokenData = {
		refreshToken: "valid-refresh-token-string",
		userId: new Types.ObjectId().toString(), // Valid MongoDB ObjectId as string
	}

	it("should pass validation with valid refreshToken data", async () => {
		const result = await runValidation(validRefreshTokenData)
		expect(result.isEmpty()).toBe(true)
	})

	it("should fail validation with missing refreshToken", async () => {
		const { refreshToken, ...missingRefreshTokenData } = validRefreshTokenData
		const result = await runValidation(missingRefreshTokenData)

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const refreshTokenError = errors.find((error) => error.path === FIELD.REFRESH_TOKEN)
		expect(refreshTokenError).toBeDefined()
	})

	it("should fail validation with non-string refreshToken", async () => {
		const result = await runValidation({
			...validRefreshTokenData,
			refreshToken: 12345, // Non-string value
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const refreshTokenError = errors.find((error) => error.path === FIELD.REFRESH_TOKEN)
		expect(refreshTokenError).toBeDefined()
	})

	it("should fail validation with missing userId", async () => {
		const { userId, ...missingUserIdData } = validRefreshTokenData
		const result = await runValidation(missingUserIdData)

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const userIdError = errors.find((error) => error.path === FIELD.USER_ID)
		expect(userIdError).toBeDefined()
	})

	it("should fail validation with non-string userId", async () => {
		const result = await runValidation({
			...validRefreshTokenData,
			userId: 12345, // Non-string value
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const userIdError = errors.find((error) => error.path === FIELD.USER_ID)
		expect(userIdError).toBeDefined()
	})

	it("should fail validation with invalid ObjectId format for userId", async () => {
		const result = await runValidation({
			...validRefreshTokenData,
			userId: "invalid-object-id-format", // Invalid ObjectId format
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const userIdError = errors.find((error) => error.path === FIELD.USER_ID)
		expect(userIdError).toBeDefined()
	})
})
```

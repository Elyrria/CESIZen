# Documentation des Tests du Sanitizer XSS

## Aperçu

Cette suite de tests unitaires vérifie que les fonctions du sanitizer XSS détectent et nettoient correctement les contenus potentiellement dangereux. Ces tests isolent les fonctions de traitement pour s'assurer qu'elles fonctionnent indépendamment du middleware.

## Objectif des Tests

Ces tests unitaires servent à :

- Vérifier que les fonctions détectent correctement les tentatives d'injection XSS dans différentes structures de données
- S'assurer que le processus de nettoyage supprime ou remplace le contenu dangereux
- Tester le traitement récursif des objets et tableaux imbriqués
- Garantir que les fonctions de détection ne produisent pas de faux positifs

## Cas de Test

### TC-001 : Nettoyage de chaînes avec balises script

- **ID** : UT-008-01
- **Description** : Vérifie que la fonction nettoie correctement les balises script
- **Entrée** : Chaîne contenant des balises script
- **Sortie Attendue** : Chaîne sans balises script et changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Nettoyage de chaînes avec JavaScript dans les attributs

- **ID** : UT-008-02
- **Description** : Vérifie que la fonction nettoie les attributs JavaScript dans les balises HTML
- **Entrée** : Chaîne avec attributs JavaScript (onerror, etc.)
- **Sortie Attendue** : Chaîne sans attributs JavaScript dangereux et changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Préservation de chaînes propres

- **ID** : UT-008-03
- **Description** : Vérifie que la fonction ne modifie pas les chaînes sans contenu dangereux
- **Entrée** : Chaîne de texte normale
- **Sortie Attendue** : Chaîne inchangée et aucun changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Gestion des entrées non-chaîne

- **ID** : UT-008-04
- **Description** : Vérifie que la fonction gère correctement les entrées qui ne sont pas des chaînes
- **Entrée** : Valeur numérique
- **Sortie Attendue** : Valeur inchangée et aucun changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-005 : Nettoyage d'objets avec XSS dans les propriétés

- **ID** : UT-008-05
- **Description** : Vérifie que la fonction nettoie les objets avec XSS dans les propriétés
- **Entrée** : Objet avec propriété contenant une balise script
- **Sortie Attendue** : Objet avec propriété nettoyée et changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Nettoyage d'objets imbriqués avec XSS

- **ID** : UT-008-06
- **Description** : Vérifie que la fonction nettoie récursivement les objets imbriqués
- **Entrée** : Objet avec sous-objet contenant du code XSS
- **Sortie Attendue** : Structure nettoyée à tous les niveaux et changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-007 : Nettoyage de tableaux avec XSS

- **ID** : UT-008-07
- **Description** : Vérifie que la fonction nettoie les tableaux contenant du code XSS
- **Entrée** : Tableau avec élément contenant une balise script
- **Sortie Attendue** : Tableau avec élément nettoyé et changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-008 : Nettoyage d'objets avec tableaux contenant XSS

- **ID** : UT-008-08
- **Description** : Vérifie que la fonction nettoie les objets avec des tableaux contenant du XSS
- **Entrée** : Objet avec tableau contenant du code XSS
- **Sortie Attendue** : Objet avec tableau nettoyé et changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-009 : Gestion des valeurs null

- **ID** : UT-008-09
- **Description** : Vérifie que la fonction gère correctement les valeurs null
- **Entrée** : Valeur null
- **Sortie Attendue** : Valeur null et aucun changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-010 : Gestion des valeurs undefined

- **ID** : UT-008-10
- **Description** : Vérifie que la fonction gère correctement les valeurs undefined
- **Entrée** : Valeur undefined
- **Sortie Attendue** : Valeur undefined et aucun changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-011 : Nettoyage d'objets avec multiples tentatives XSS

- **ID** : UT-008-11
- **Description** : Vérifie que la fonction détecte et nettoie plusieurs tentatives XSS dans un objet
- **Entrée** : Objet avec plusieurs propriétés contenant du code XSS
- **Sortie Attendue** : Objet avec toutes les propriétés nettoyées et multiples changements détectés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-012 : Préservation d'objets sans contenu XSS

- **ID** : UT-008-12
- **Description** : Vérifie que la fonction ne modifie pas les objets sans contenu dangereux
- **Entrée** : Objet complexe sans code XSS
- **Sortie Attendue** : Objet inchangé et aucun changement détecté
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-013 : Gestion de structures imbriquées complexes

- **ID** : UT-008-13
- **Description** : Vérifie que la fonction gère correctement les structures imbriquées complexes
- **Entrée** : Objet avec tableaux et sous-objets contenant du code XSS à différents niveaux
- **Sortie Attendue** : Structure entièrement nettoyée et tous les changements détectés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Méthodologie

Ces tests utilisent une approche isolée :

- Ils testent directement les fonctions de nettoyage sans passer par le middleware
- Ils fournissent des cas d'entrée diversifiés pour couvrir différents vecteurs d'attaque XSS
- Ils vérifient à la fois la détection correcte et l'absence de faux positifs
- Ils contrôlent la structure des données nettoyées et les changements rapportés

## Points techniques importants

- Les tests vérifient que les balises et attributs dangereux sont correctement supprimés
- La vérification de la structure récursive pour les objets et tableaux imbriqués est essentielle
- La vérification des faux positifs garantit que le contenu légitime n'est pas affecté
- Les tests couvrent tous les patterns d'attaque XSS courants

## Implémentation des Tests

```typescript
import { sanitizeString, deepXssSanitize } from "@middlewares/sanitizers/xss.sanitizer.ts"

describe("XSS Sanitizer Utils", () => {
	// Tests pour sanitizeString
	describe("sanitizeString", () => {
		it("should sanitize strings with script tags", () => {
			const input = "<script>alert('XSS')</script>Bonjour"
			const { result, changed } = sanitizeString(input)

			expect(result).not.toContain("<script>")
			expect(changed).toBe(true)
		})

		it("should sanitize strings with javascript in attributes", () => {
			const input = '<img src="x" onerror="alert(\'XSS\')">'
			const { result, changed } = sanitizeString(input)

			expect(result).not.toContain("onerror")
			expect(changed).toBe(true)
		})

		it("should not modify clean strings", () => {
			const input = "Bonjour, comment allez-vous?"
			const { result, changed } = sanitizeString(input)

			expect(result).toBe(input)
			expect(changed).toBe(false)
		})

		it("should handle non-string inputs", () => {
			const input = 123
			const { result, changed } = sanitizeString(input as any)

			expect(result).toBe(input)
			expect(changed).toBe(false)
		})
	})

	// Tests pour deepXssSanitize
	describe("deepXssSanitize", () => {
		it("should sanitize objects with XSS in string properties", () => {
			const input = {
				name: "User",
				description: "<script>alert('XSS')</script>",
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.description).not.toContain("<script>")
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("XSS content detected")
		})

		it("should sanitize nested objects with XSS", () => {
			const input = {
				user: {
					name: "User",
					bio: "<img src='x' onerror='alert(\"XSS\")'>",
				},
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.user.bio).not.toContain("onerror")
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("user.bio")
		})

		it("should sanitize arrays with XSS", () => {
			const input = ["normal text", "<script>alert('XSS')</script>", 123]
			const { result, changes } = deepXssSanitize(input)

			expect(result[1]).not.toContain("<script>")
			expect(changes.length).toBe(1)
		})

		it("should sanitize objects with arrays containing XSS", () => {
			const input = {
				name: "User",
				comments: ["Good article", "<iframe src='javascript:alert(\"XSS\")'></iframe>"],
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.comments[1]).not.toContain("<iframe")
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("comments.1")
		})

		it("should handle null values", () => {
			const input = null
			const { result, changes } = deepXssSanitize(input)

			expect(result).toBe(null)
			expect(changes.length).toBe(0)
		})

		it("should handle undefined values", () => {
			const input = undefined
			const { result, changes } = deepXssSanitize(input)

			expect(result).toBe(undefined)
			expect(changes.length).toBe(0)
		})

		it("should sanitize objects with multiple XSS attempts", () => {
			const input = {
				name: "<script>alert('Name')</script>",
				description: "<img src='x' onerror='alert(\"Description\")'>",
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.name).not.toContain("<script>")
			expect(result.description).not.toContain("onerror")
			expect(changes.length).toBe(2)
		})

		it("should not modify objects without XSS content", () => {
			const input = {
				name: "User",
				age: 30,
				address: {
					street: "123 Main St",
					city: "Paris",
				},
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result).toEqual(input)
			expect(changes.length).toBe(0)
		})

		it("should handle complex nested structures", () => {
			const input = {
				users: [
					{
						name: "User1",
						comments: ["Nice", "<script>alert('XSS')</script>"],
					},
					{
						name: "<img src='x' onerror='alert(\"XSS\")'>",
					},
				],
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.users[0].comments[1]).not.toContain("<script>")
			expect(result.users[1].name).not.toContain("onerror")
			expect(changes.length).toBe(2)
		})
	})
})
```

# Documentation des Tests du Sanitizer MongoDB

## Aperçu

Cette suite de tests unitaires vérifie que les fonctions du sanitizer MongoDB détectent et nettoient correctement les données potentiellement dangereuses. Ces tests isolent les fonctions de traitement pour s'assurer qu'elles fonctionnent indépendamment du middleware.

## Objectif des Tests

Ces tests unitaires servent à :

- Vérifier que les fonctions détectent correctement les opérateurs MongoDB dans différentes structures de données
- S'assurer que le processus de nettoyage supprime ou remplace les valeurs dangereuses
- Tester le traitement récursif des objets et tableaux imbriqués
- Garantir que les fonctions de détection ne produisent pas de faux positifs

## Cas de Test

### TC-001 : Détection d'opérateurs MongoDB dans une chaîne

- **ID** : UT-001-01
- **Description** : Vérifie que la fonction détecte correctement les opérateurs MongoDB dans une chaîne
- **Entrée** : Chaînes contenant des opérateurs MongoDB ($eq, $ne, $in)
- **Sortie Attendue** : Valeur true indiquant la présence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Absence d'opérateurs MongoDB dans une chaîne

- **ID** : UT-001-02
- **Description** : Vérifie que la fonction ne signale pas de faux positifs pour des chaînes normales
- **Entrée** : Chaînes sans opérateurs MongoDB
- **Sortie Attendue** : Valeur false indiquant l'absence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Gestion des entrées non-chaîne

- **ID** : UT-001-03
- **Description** : Vérifie que la fonction gère correctement les entrées qui ne sont pas des chaînes
- **Entrée** : Valeurs null, undefined, numériques
- **Sortie Attendue** : Valeur false pour tous les cas
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Détection d'opérateurs dans les clés d'objet

- **ID** : UT-001-04
- **Description** : Vérifie que la fonction détecte les clés commençant par $
- **Entrée** : Clés commençant par $ ($eq, $where)
- **Sortie Attendue** : Valeur true indiquant la présence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-005 : Détection de motifs field[$operator]

- **ID** : UT-001-05
- **Description** : Vérifie que la fonction détecte les motifs de type field[$operator]
- **Entrée** : Clés avec le format field[$op]
- **Sortie Attendue** : Valeur true indiquant la présence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Détection de notation pointée avec opérateurs

- **ID** : UT-001-06
- **Description** : Vérifie que la fonction détecte les opérateurs dans une notation pointée
- **Entrée** : Clés avec format field.subfield.$operator
- **Sortie Attendue** : Valeur true indiquant la présence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-007 : Validation de clés sécurisées

- **ID** : UT-001-07
- **Description** : Vérifie que la fonction ne signale pas de faux positifs pour des clés normales
- **Entrée** : Clés sans opérateurs MongoDB
- **Sortie Attendue** : Valeur false indiquant l'absence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-008 : Détection d'opérateurs dans les valeurs de chaîne

- **ID** : UT-001-08
- **Description** : Vérifie que la fonction détecte les opérateurs MongoDB dans les valeurs
- **Entrée** : Chaînes contenant des opérateurs ($ne, $exists)
- **Sortie Attendue** : Valeur true indiquant la présence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-009 : Détection d'opérateurs dans les chaînes JSON

- **ID** : UT-001-09
- **Description** : Vérifie que la fonction détecte les opérateurs dans les chaînes JSON
- **Entrée** : Chaînes JSON contenant des opérateurs
- **Sortie Attendue** : Valeur true indiquant la présence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-010 : Détection d'opérateurs dans les objets

- **ID** : UT-001-10
- **Description** : Vérifie que la fonction détecte les opérateurs dans les objets
- **Entrée** : Objets avec des clés d'opérateurs
- **Sortie Attendue** : Valeur true indiquant la présence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-011 : Validation de valeurs sécurisées

- **ID** : UT-001-11
- **Description** : Vérifie que la fonction ne signale pas de faux positifs pour des valeurs normales
- **Entrée** : Valeurs sans opérateurs MongoDB
- **Sortie Attendue** : Valeur false indiquant l'absence d'opérateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-012 : Nettoyage d'objets avec opérateurs dans les clés

- **ID** : UT-001-12
- **Description** : Vérifie que la fonction nettoie correctement les objets avec des opérateurs dans les clés
- **Entrée** : Objet avec des clés contenant des opérateurs
- **Sortie Attendue** : Objet nettoyé sans les clés dangereuses et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-013 : Nettoyage d'objets avec opérateurs dans les valeurs

- **ID** : UT-001-13
- **Description** : Vérifie que la fonction nettoie correctement les objets avec des opérateurs dans les valeurs
- **Entrée** : Objet avec des valeurs contenant des opérateurs
- **Sortie Attendue** : Objet avec valeurs dangereuses remplacées et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-014 : Nettoyage récursif d'objets imbriqués

- **ID** : UT-001-14
- **Description** : Vérifie que la fonction nettoie récursivement les objets imbriqués
- **Entrée** : Objet avec des sous-objets contenant des opérateurs
- **Sortie Attendue** : Structure nettoyée à tous les niveaux et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-015 : Nettoyage d'objets avec tableaux

- **ID** : UT-001-15
- **Description** : Vérifie que la fonction nettoie correctement les objets contenant des tableaux
- **Entrée** : Objet avec tableau contenant des valeurs dangereuses
- **Sortie Attendue** : Objet avec tableau nettoyé et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-016 : Gestion d'entrées null ou undefined

- **ID** : UT-001-16
- **Description** : Vérifie que la fonction gère correctement les entrées null ou undefined
- **Entrée** : Valeurs null et undefined
- **Sortie Attendue** : Objet vide sans erreurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-017 : Nettoyage de tableaux avec opérateurs

- **ID** : UT-001-17
- **Description** : Vérifie que la fonction nettoie correctement les tableaux contenant des opérateurs
- **Entrée** : Tableau avec valeurs contenant des opérateurs
- **Sortie Attendue** : Tableau avec valeurs dangereuses remplacées et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-018 : Nettoyage récursif de tableaux imbriqués

- **ID** : UT-001-18
- **Description** : Vérifie que la fonction nettoie récursivement les tableaux imbriqués
- **Entrée** : Tableau avec des sous-tableaux contenant des opérateurs
- **Sortie Attendue** : Structure nettoyée à tous les niveaux et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-019 : Nettoyage de tableaux contenant des objets

- **ID** : UT-001-19
- **Description** : Vérifie que la fonction nettoie correctement les tableaux d'objets
- **Entrée** : Tableau contenant des objets avec opérateurs
- **Sortie Attendue** : Tableau avec objets nettoyés et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-020 : Gestion des tableaux vides

- **ID** : UT-001-20
- **Description** : Vérifie que la fonction gère correctement les tableaux vides
- **Entrée** : Tableau vide
- **Sortie Attendue** : Tableau vide sans erreurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-021 : Nettoyage des paramètres de route avec opérateurs

- **ID** : UT-001-21
- **Description** : Vérifie que la fonction nettoie correctement les paramètres de route avec opérateurs
- **Entrée** : Objet params avec valeurs contenant des opérateurs
- **Sortie Attendue** : Objet params nettoyé et changements notés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-022 : Détection d'opérateurs spécifiques dans les paramètres

- **ID** : UT-001-22
- **Description** : Vérifie que la fonction détecte des opérateurs spécifiques dans les paramètres
- **Entrée** : Paramètres avec opérateurs $exists, $gt, $eq, $in
- **Sortie Attendue** : Paramètres nettoyés et changements pour chaque opérateur
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-023 : Validation de paramètres de route sécurisés

- **ID** : UT-001-23
- **Description** : Vérifie que la fonction ne modifie pas les paramètres sécurisés
- **Entrée** : Paramètres sans opérateurs MongoDB
- **Sortie Attendue** : Paramètres inchangés sans signalement
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-024 : Gestion de valeurs non-chaîne dans les paramètres

- **ID** : UT-001-24
- **Description** : Vérifie que la fonction gère correctement les valeurs non-chaîne dans les paramètres
- **Entrée** : Paramètres avec valeurs numériques et booléennes
- **Sortie Attendue** : Paramètres inchangés sans erreurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Méthodologie

Ces tests utilisent une approche isolée :

- Ils testent directement les fonctions de détection et de nettoyage sans passer par le middleware
- Ils fournissent des cas d'entrée diversifiés pour couvrir différents scénarios
- Ils vérifient à la fois la détection correcte et l'absence de faux positifs
- Ils contrôlent la structure des données nettoyées et les changements rapportés

## Points techniques importants

- L'utilisation de fonctions pures facilite le test isolé
- Les tests vérifient la structure récursive pour les objets et tableaux imbriqués
- La vérification des faux positifs est aussi importante que la détection des cas positifs
- Les tests couvrent tous les patterns d'injection NoSQL courants

## Implémentation des Tests

```typescript
import {
	stringContainsMongoOperator,
	containsMongoOperatorInKey,
	containsMongoOperatorInValue,
	sanitizeMongoObject,
	sanitizeMongoArray,
	sanitizeRouteParams,
} from "@middlewares/sanitizers/mongo.sanitizer.ts"

describe("MongoDB Sanitizer Utils", () => {
	// Tests pour stringContainsMongoOperator
	describe("stringContainsMongoOperator", () => {
		it("should return true when string contains a MongoDB operator", () => {
			expect(stringContainsMongoOperator("field$eq: 'value'")).toBe(true)
			expect(stringContainsMongoOperator("check if $ne: null")).toBe(true)
			expect(stringContainsMongoOperator("using the $in operator")).toBe(true)
		})

		it("should return false when string does not contain MongoDB operators", () => {
			expect(stringContainsMongoOperator("normal string")).toBe(false)
			expect(stringContainsMongoOperator("cash value is $50")).toBe(false)
			expect(stringContainsMongoOperator("")).toBe(false)
		})

		it("should return false for non-string inputs", () => {
			expect(stringContainsMongoOperator(null as any)).toBe(false)
			expect(stringContainsMongoOperator(undefined as any)).toBe(false)
			expect(stringContainsMongoOperator(123 as any)).toBe(false)
		})
	})

	// Tests pour containsMongoOperatorInKey
	describe("containsMongoOperatorInKey", () => {
		it("should detect keys starting with $", () => {
			expect(containsMongoOperatorInKey("$eq")).toBe(true)
			expect(containsMongoOperatorInKey("$where")).toBe(true)
		})

		it("should detect field[$operator] patterns", () => {
			expect(containsMongoOperatorInKey("field[$eq]")).toBe(true)
			expect(containsMongoOperatorInKey("name[$regex]")).toBe(true)
		})

		it("should detect dot notation with operators", () => {
			expect(containsMongoOperatorInKey("user.preferences.$all")).toBe(true)
			expect(containsMongoOperatorInKey("items.tags[$in]")).toBe(true)
		})

		it("should return false for safe keys", () => {
			expect(containsMongoOperatorInKey("name")).toBe(false)
			expect(containsMongoOperatorInKey("user.profile")).toBe(false)
			expect(containsMongoOperatorInKey("price$value")).toBe(false)
		})
	})

	// Tests pour containsMongoOperatorInValue
	describe("containsMongoOperatorInValue", () => {
		it("should detect MongoDB operators in strings", () => {
			expect(containsMongoOperatorInValue("$ne")).toBe(true)
			expect(containsMongoOperatorInValue("check $exists value")).toBe(true)
		})

		it("should detect operators in JSON strings", () => {
			expect(containsMongoOperatorInValue('{"$eq": 100}')).toBe(true)
			expect(containsMongoOperatorInValue('[{"field": {"$ne": null}}]')).toBe(true)
		})

		it("should detect operators in objects", () => {
			expect(containsMongoOperatorInValue({ $gt: 50 })).toBe(true)
			expect(containsMongoOperatorInValue({ price: { $lt: 100 } })).toBe(true)
		})

		it("should return false for safe values", () => {
			expect(containsMongoOperatorInValue("normal text")).toBe(false)
			expect(containsMongoOperatorInValue(123)).toBe(false)
			expect(containsMongoOperatorInValue({ price: 100 })).toBe(false)
			expect(containsMongoOperatorInValue('{"price": 50}')).toBe(false)
		})
	})

	// Tests pour sanitizeMongoObject
	describe("sanitizeMongoObject", () => {
		it("should sanitize objects with MongoDB operators in keys", () => {
			const input = { name: "John", $where: "func()", age: 30 }
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({ name: "John", age: 30 })
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator detected in key")
		})

		it("should sanitize objects with MongoDB operators in values", () => {
			const input = { name: "John", query: "$ne: null", age: 30 }
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({ name: "John", query: "", age: 30 })
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator detected in value")
		})

		it("should sanitize nested objects recursively", () => {
			const input = {
				name: "John",
				preferences: {
					$or: [{ type: "food" }, { type: "drink" }],
					color: "blue",
				},
			}
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({
				name: "John",
				preferences: {
					color: "blue",
				},
			})
			expect(changes.length).toBe(1)
		})

		it("should sanitize objects with arrays", () => {
			const input = {
				name: "John",
				tags: ["normal", "$where: func()", "safe"],
			}
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({
				name: "John",
				tags: ["normal", "", "safe"],
			})
			expect(changes.length).toBe(1)
		})

		it("should return empty object for null or undefined input", () => {
			const { sanitized: sanitized1, changes: changes1 } = sanitizeMongoObject(null)
			const { sanitized: sanitized2, changes: changes2 } = sanitizeMongoObject(undefined)

			expect(sanitized1).toEqual({})
			expect(sanitized2).toEqual({})
			expect(changes1.length).toBe(0)
			expect(changes2.length).toBe(0)
		})
	})

	// Tests pour sanitizeMongoArray
	describe("sanitizeMongoArray", () => {
		it("should sanitize arrays with MongoDB operators", () => {
			const input = ["normal", "$eq", 123, "safe"]
			const { sanitized, changes } = sanitizeMongoArray(input, "path")

			expect(sanitized).toEqual(["normal", "", 123, "safe"])
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator detected in array value")
		})

		it("should sanitize nested arrays recursively", () => {
			const input = ["normal", ["$ne", "ok"], "safe"]
			const { sanitized, changes } = sanitizeMongoArray(input, "path")

			expect(sanitized).toEqual(["normal", ["", "ok"], "safe"])
			expect(changes.length).toBe(1)
		})

		it("should sanitize arrays containing objects", () => {
			const input = [{ name: "John" }, { $where: "function()" }, { age: 30 }]
			const { sanitized, changes } = sanitizeMongoArray(input, "path")

			expect(sanitized).toEqual([{ name: "John" }, {}, { age: 30 }])
			expect(changes.length).toBe(1)
		})

		it("should handle empty arrays", () => {
			const { sanitized, changes } = sanitizeMongoArray([], "path")

			expect(sanitized).toEqual([])
			expect(changes.length).toBe(0)
		})
	})

	// Tests pour sanitizeRouteParams
	describe("sanitizeRouteParams", () => {
		it("should sanitize route parameters containing MongoDB operators", () => {
			const input = { id: "123", query: "$ne: null" }
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual({ id: "123", query: "" })
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator $ne detected in route param")
		})

		it("should detect specific MongoDB operators in route params", () => {
			const input = {
				id: "123",
				exists: "$exists:true",
				compare: "$gt:50",
				eq: "$eq:value",
				items: "$in:[1,2,3]",
			}
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual({
				id: "123",
				exists: "",
				compare: "",
				eq: "",
				items: "",
			})
			expect(changes.length).toBe(4)
		})

		it("should not sanitize route parameters without MongoDB operators", () => {
			const input = { id: "123", name: "John", amount: "$50" }
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual(input)
			expect(changes.length).toBe(0)
		})

		it("should handle non-string values in route parameters", () => {
			const input = { id: 123, active: true }
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual(input)
			expect(changes.length).toBe(0)
		})
	})
})
```
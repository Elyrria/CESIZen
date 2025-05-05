# Documentation de Test : Fonction normalize

## Aperçu
La fonction `normalize` est un utilitaire conçu pour gérer la validation et la conversion des numéros de port. Elle transforme les entrées de type chaîne de caractères en valeurs numériques de port appropriées lorsque c'est possible, conserve l'entrée originale lorsqu'elle n'est pas un nombre valide, et effectue une validation pour empêcher les numéros de port invalides.

## Objectif de la Fonction
La fonction `normalize` sert à :
- Convertir les valeurs de port de type chaîne en format numérique pour l'utilisation système
- Valider que les numéros de port répondent aux exigences de base (valeurs positives)
- Conserver l'entrée originale si elle n'est pas convertible en nombre

## Cas de Test

### TC-001 : Conversion d'un Numéro de Port Valide
- **ID** : UT-001-01
- **Description** : Vérifie qu'une chaîne numérique valide est correctement convertie en nombre
- **Entrée** : "4550"
- **Sortie Attendue** : 4550 (type nombre)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

### TC-002 : Gestion des Entrées Non-Numériques
- **ID** : UT-001-02
- **Description** : Confirme que les entrées non-numériques sont retournées sans modification
- **Entrée** : "abc"
- **Sortie Attendue** : "abc" (type chaîne, valeur originale)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

### TC-003 : Validation des Valeurs Négatives
- **ID** : UT-001-03
- **Description** : Teste la gestion des erreurs pour les numéros de port négatifs
- **Entrée** : "-1"
- **Sortie Attendue** : Erreur avec message "Value cannot be ≤ to 0: -1"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

### TC-004 : Port Valide Minimum
- **ID** : UT-001-04
- **Description** : Confirme que le numéro de port valide minimum (1) est accepté
- **Entrée** : "1"
- **Sortie Attendue** : 1 (type nombre)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

### TC-005 : Gestion des Nombres Décimaux
- **ID** : UT-001-05
- **Description** : Teste que les nombres décimaux sont correctement tronqués
- **Entrée** : "45.67"
- **Sortie Attendue** : 45 (type nombre, tronqué)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

### TC-006 : Gestion des Chaînes Mixtes
- **ID** : UT-001-06
- **Description** : Vérifie l'analyse correcte des chaînes commençant par des nombres
- **Entrée** : "123abc"
- **Sortie Attendue** : 123 (type nombre, portion analysée)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

### TC-007 : Gestion des Chaînes Vides
- **ID** : UT-001-07
- **Description** : Teste la gestion des entrées de chaînes vides
- **Entrée** : ""
- **Sortie Attendue** : "" (chaîne vide retournée sans modification)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

### TC-008 : Validation de la Valeur Zéro
- **ID** : UT-001-08
- **Description** : Confirme que zéro est rejeté comme port invalide
- **Entrée** : "0"
- **Sortie Attendue** : Erreur avec message "Value cannot be ≤ to 0: 0"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 05-05-2025

## Implémentation du Test

```typescript
import { normalize } from "@server/normalize.ts"

describe("normalize", () => {
    // Test de conversion d'un numéro de port valide
    it("should return the correct port number when the input is a valid numeric string", () =>
        expect(normalize("4550")).toBe(4550))

    // Test de gestion des entrées non-numériques
    it("should return the original string if the input is not a valid number", () =>
        expect(normalize("abc")).toBe("abc"))

    // Test de gestion des erreurs pour les valeurs négatives
    it("should throw an error if the input is <= 0", () => {
        expect(() => normalize("-1")).toThrow("Value cannot be ≤ to 0: -1")
    })
    
    // Cas limite : port valide minimum
    it("should accept the value 1 as valid", () => {
        expect(normalize("1")).toBe(1)
    })

    // Test de gestion des nombres décimaux
    it("should truncate decimal numbers", () => {
        expect(normalize("45.67")).toBe(45)
    })

    // Test de gestion des chaînes mixtes commençant par des nombres
    it("should parse the beginning of mixed strings", () => {
        expect(normalize("123abc")).toBe(123)
    })

    // Test de gestion des chaînes vides
    it("should handle empty strings", () => {
        expect(normalize("")).toBe("")
    })

    // Test de la valeur zéro
    it("should throw an error if the input is 0", () => {
        // Utilisation de l'approche alternative avec un matcher plus spécifique
        expect(() => normalize("0")).toThrow()
        expect(() => normalize("0")).toThrow(Error)
        expect(() => normalize("0")).toThrow("Value cannot be ≤ to 0: 0")
    })
})
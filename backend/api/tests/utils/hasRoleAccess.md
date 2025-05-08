# Documentation de Test : Fonctions de Validation des Rôles

## Aperçu
Ce module fournit des utilitaires pour valider et comparer les rôles d'utilisateurs dans le système d'autorisation. Il permet de vérifier si un rôle est valide et d'évaluer les droits d'accès basés sur la hiérarchie des rôles.

## Configuration des Rôles
Le système définit actuellement deux rôles :
- `administrator` (ADMIN) : niveau d'accès le plus élevé
- `user` (REGISTERED_USER) : niveau d'accès standard

La hiérarchie est définie comme suit : [ADMIN, REGISTERED_USER], où ADMIN est le rôle le plus élevé.

## Objectif des Fonctions

### isValidRole
La fonction `isValidRole` sert à :
- Vérifier si une chaîne de caractères correspond à un rôle valide dans le système
- Comparer la chaîne aux valeurs définies dans l'énumération `ROLES`
- Retourner un booléen indiquant si le rôle est valide

### hasRoleAccess
La fonction `hasRoleAccess` sert à :
- Déterminer si un utilisateur avec un certain rôle a accès à des fonctionnalités nécessitant un rôle spécifique
- Comparer les positions des rôles dans la hiérarchie définie
- Implémenter le principe qu'un rôle supérieur inclut tous les droits des rôles inférieurs

## Cas de Test pour isValidRole

### TC-001 : Validation du Rôle Administrateur
- **ID** : UT-004-01
- **Description** : Vérifie que le rôle administrateur est correctement identifié comme valide
- **Entrée** : "administrator"
- **Sortie Attendue** : true
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Validation du Rôle Utilisateur
- **ID** : UT-004-02
- **Description** : Vérifie que le rôle utilisateur est correctement identifié comme valide
- **Entrée** : "user"
- **Sortie Attendue** : true
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Rejet d'un Rôle Invalide
- **ID** : UT-004-03
- **Description** : Vérifie qu'une chaîne non définie dans ROLES est rejetée
- **Entrée** : "guest"
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Sensibilité à la Casse
- **ID** : UT-004-04
- **Description** : Vérifie que la fonction est sensible à la casse
- **Entrée** : "Administrator"
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Cas de Test pour hasRoleAccess

### TC-005 : Accès avec Rôle Identique - Administrateur
- **ID** : UT-004-05
- **Description** : Vérifie qu'un administrateur peut accéder aux fonctionnalités d'administrateur
- **Entrée** : userRole: "administrator", requiredRole: "administrator"
- **Sortie Attendue** : true
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Accès avec Rôle Identique - Utilisateur
- **ID** : UT-004-06
- **Description** : Vérifie qu'un utilisateur peut accéder aux fonctionnalités d'utilisateur
- **Entrée** : userRole: "user", requiredRole: "user"
- **Sortie Attendue** : true
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-007 : Accès avec Rôle Supérieur
- **ID** : UT-004-07
- **Description** : Vérifie qu'un administrateur a accès aux fonctionnalités utilisateur
- **Entrée** : userRole: "administrator", requiredRole: "user"
- **Sortie Attendue** : true
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-008 : Refus avec Rôle Inférieur
- **ID** : UT-004-08
- **Description** : Vérifie qu'un utilisateur n'a pas accès aux fonctionnalités administrateur
- **Entrée** : userRole: "user", requiredRole: "administrator"
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-009 : Gestion d'un Rôle Utilisateur Invalide
- **ID** : UT-004-09
- **Description** : Vérifie que la fonction gère correctement un rôle utilisateur non défini
- **Entrée** : userRole: "guest", requiredRole: "user"
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-010 : Gestion d'un Rôle Requis Invalide
- **ID** : UT-004-10
- **Description** : Vérifie que la fonction gère correctement un rôle requis non défini
- **Entrée** : userRole: "administrator", requiredRole: "moderator"
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Implémentation des Tests

```typescript
import { isValidRole, hasRoleAccess } from "@utils/role.ts"
import { ROLES } from "@configs/role.configs.ts"

describe("isValidRole", () => {
    // Test for administrator role
    it("should return true for administrator role", () => {
        expect(isValidRole("administrator")).toBe(true)
    })

    // Test for user role
    it("should return true for user role", () => {
        expect(isValidRole("user")).toBe(true)
    })

    // Test for an invalid role
    it("should return false for an invalid role", () => {
        expect(isValidRole("guest")).toBe(false)
        expect(isValidRole("")).toBe(false)
        expect(isValidRole("moderator")).toBe(false)
    })

    // Test for case sensitivity
    it("should be case sensitive", () => {
        expect(isValidRole("Administrator")).toBe(false)
        expect(isValidRole("USER")).toBe(false)
    })
})

describe("hasRoleAccess", () => {
    // Test for admin accessing admin features
    it("should return true when admin accesses admin features", () => {
        expect(hasRoleAccess(ROLES.ADMIN, ROLES.ADMIN)).toBe(true)
    })

    // Test for user accessing user features
    it("should return true when user accesses user features", () => {
        expect(hasRoleAccess(ROLES.REGISTERED_USER, ROLES.REGISTERED_USER)).toBe(true)
    })

    // Test for admin accessing user features
    it("should return true when admin accesses user features", () => {
        expect(hasRoleAccess(ROLES.ADMIN, ROLES.REGISTERED_USER)).toBe(true)
    })

    // Test for user trying to access admin features
    it("should return false when user tries to access admin features", () => {
        expect(hasRoleAccess(ROLES.REGISTERED_USER, ROLES.ADMIN)).toBe(false)
    })

    // Test for an invalid user role
    it("should return false when user role is not in hierarchy", () => {
        expect(hasRoleAccess("guest", ROLES.REGISTERED_USER)).toBe(false)
    })

    // Test for an invalid required role
    it("should return false when required role is not in hierarchy", () => {
        expect(hasRoleAccess(ROLES.ADMIN, "moderator")).toBe(false)
    })

    // Test for both roles being invalid
    it("should return false when both roles are invalid", () => {
        expect(hasRoleAccess("guest", "moderator")).toBe(false)
    })
})
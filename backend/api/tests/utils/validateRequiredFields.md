# Documentation de Test : Fonction validateRequiredUserFields

## Aperçu
Ce module fournit une fonction permettant de valider la présence de tous les champs requis lors de la création d'un utilisateur. Cette validation garantit que les informations essentielles sont fournies avant de procéder à l'enregistrement d'un nouvel utilisateur dans le système.

## Objectif de la Fonction

### validateRequiredUserFields
La fonction `validateRequiredUserFields` sert à :
- Vérifier que tous les champs obligatoires pour la création d'un utilisateur sont présents
- Valider que les champs requis ne sont pas vides
- Garantir l'intégrité des données utilisateur avant leur traitement

## Champs Requis pour la Création d'un Utilisateur
Les champs suivants sont considérés comme obligatoires pour la création d'un utilisateur :
- `role` : Rôle de l'utilisateur dans le système
- `password` : Mot de passe de l'utilisateur
- `email` : Adresse e-mail de l'utilisateur
- `name` : Nom de famille de l'utilisateur
- `firstName` : Prénom de l'utilisateur
- `birthDate` : Date de naissance de l'utilisateur

## Cas de Test

### TC-001 : Validation d'un Utilisateur Complet
- **ID** : UT-006-01
- **Description** : Vérifie que la fonction retourne true quand tous les champs requis sont présents
- **Entrée** : Objet utilisateur avec tous les champs requis renseignés
- **Sortie Attendue** : true
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Détection d'un Champ Manquant - Role
- **ID** : UT-006-02
- **Description** : Vérifie que la fonction détecte l'absence du champ role
- **Entrée** : Objet utilisateur sans le champ role
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Détection d'un Champ Manquant - Password
- **ID** : UT-006-03
- **Description** : Vérifie que la fonction détecte l'absence du champ password
- **Entrée** : Objet utilisateur sans le champ password
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Détection d'un Champ Manquant - Email
- **ID** : UT-006-04
- **Description** : Vérifie que la fonction détecte l'absence du champ email
- **Entrée** : Objet utilisateur sans le champ email
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-005 : Détection d'un Champ Manquant - Name
- **ID** : UT-006-05
- **Description** : Vérifie que la fonction détecte l'absence du champ name
- **Entrée** : Objet utilisateur sans le champ name
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Détection d'un Champ Manquant - FirstName
- **ID** : UT-006-06
- **Description** : Vérifie que la fonction détecte l'absence du champ firstName
- **Entrée** : Objet utilisateur sans le champ firstName
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-007 : Détection d'un Champ Manquant - BirthDate
- **ID** : UT-006-07
- **Description** : Vérifie que la fonction détecte l'absence du champ birthDate
- **Entrée** : Objet utilisateur sans le champ birthDate
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-008 : Gestion des Champs Vides
- **ID** : UT-006-08
- **Description** : Vérifie que la fonction détecte les champs requis avec valeur vide
- **Entrée** : Objet utilisateur avec le champ role vide ("")
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-009 : Gestion d'un Objet Vide
- **ID** : UT-006-09
- **Description** : Vérifie que la fonction retourne false pour un objet vide
- **Entrée** : Objet vide ({})
- **Sortie Attendue** : false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Implémentation des Tests

```typescript
import { validateRequiredUserFields } from "@utils/validationRequiredFields.ts"
import type { IUserCreate } from "@api/types/user.d.ts"

describe("validateRequiredUserFields", () => {
  // Test for a valid user with all required fields
  it("should return true when all required fields are present", () => {
    const validUser: Partial<IUserCreate> = {
      role: "user",
      password: "Password123",
      email: "user@example.com",
      name: "Doe",
      firstName: "John",
      birthDate: new Date("1990-01-01"),
    }

    expect(validateRequiredUserFields(validUser)).toBe(true)
  })

  // Test for missing fields
  it("should return false when any required field is missing", () => {
    // Missing role
    expect(
      validateRequiredUserFields({
        password: "Password123",
        email: "user@example.com",
        name: "Doe",
        firstName: "John",
        birthDate: new Date("1990-01-01"),
      })
    ).toBe(false)

    // Missing password
    expect(
      validateRequiredUserFields({
        role: "user",
        email: "user@example.com",
        name: "Doe",
        firstName: "John",
        birthDate: new Date("1990-01-01"),
      })
    ).toBe(false)

    // Missing email
    expect(
      validateRequiredUserFields({
        role: "user",
        password: "Password123",
        name: "Doe",
        firstName: "John",
        birthDate: new Date("1990-01-01"),
      })
    ).toBe(false)

    // Missing name
    expect(
      validateRequiredUserFields({
        role: "user",
        password: "Password123",
        email: "user@example.com",
        firstName: "John",
        birthDate: new Date("1990-01-01"),
      })
    ).toBe(false)

    // Missing firstName
    expect(
      validateRequiredUserFields({
        role: "user",
        password: "Password123",
        email: "user@example.com",
        name: "Doe",
        birthDate: new Date("1990-01-01"),
      })
    ).toBe(false)

    // Missing birthDate
    expect(
      validateRequiredUserFields({
        role: "user",
        password: "Password123",
        email: "user@example.com",
        name: "Doe",
        firstName: "John",
      })
    ).toBe(false)
  })

  // Test for empty string values
  it("should return false when any required field is an empty string", () => {
    const userWithEmptyStrings: Partial<IUserCreate> = {
      role: "",
      password: "Password123",
      email: "user@example.com",
      name: "Doe",
      firstName: "John",
      birthDate: new Date("1990-01-01"),
    }

    expect(validateRequiredUserFields(userWithEmptyStrings)).toBe(false)
  })

  // Test for empty object
  it("should return false for an empty object", () => {
    expect(validateRequiredUserFields({})).toBe(false)
  })
})
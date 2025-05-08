# Documentation de Test : Fonctions de Cryptage et Traitement des Données

## Aperçu
Ce module fournit des fonctions de cryptage et de traitement des données utilisateur pour sécuriser les informations sensibles. Il comprend le cryptage réversible des données personnelles et le hachage sécurisé des mots de passe, ainsi que des méthodes pour traiter et décrypter ces données.

## Objectif des Fonctions

### encrypt
La fonction `encrypt` sert à :
- Crypter les données sensibles de manière réversible
- Utiliser l'algorithme AES-256-CBC pour un niveau de sécurité élevé
- Générer et stocker un vecteur d'initialisation (IV) aléatoire avec chaque donnée

### decrypt
La fonction `decrypt` sert à :
- Décrypter les données précédemment cryptées par la fonction `encrypt`
- Récupérer l'IV stocké avec les données cryptées
- Reconstruire les données originales en texte clair

### processUserData
La fonction `processUserData` sert à :
- Crypter les informations sensibles des utilisateurs (nom, prénom, date de naissance)
- Hacher le mot de passe de façon non réversible
- Créer un nouvel objet utilisateur avec les données sécurisées

### processRefreshToken
La fonction `processRefreshToken` sert à :
- Crypter les informations de connexion (adresse IP, user-agent)
- Créer un nouvel objet de jeton de rafraîchissement avec les données sécurisées
- Vérifier que le userId est au format MongoDB ID

### decryptData
La fonction `decryptData` sert à :
- Décrypter les champs spécifiés dans un objet utilisateur
- Traiter spécifiquement les dates de naissance pour les reconvertir en objets Date
- Gérer les erreurs de décryptage de manière gracieuse

## Cas de Test pour encrypt

### TC-001 : Cryptage de Base
- **ID** : UT-003-01
- **Description** : Vérifie que la fonction crypte correctement une chaîne simple
- **Entrée** : "test"
- **Sortie Attendue** : Chaîne au format "[IV]:[Données cryptées]"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-002 : Cryptage de Chaîne Complexe
- **ID** : UT-003-02
- **Description** : Teste le cryptage d'une chaîne contenant des caractères spéciaux
- **Entrée** : "Test@123!#+éèê"
- **Sortie Attendue** : Chaîne au format "[IV]:[Données cryptées]"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-003 : Cohérence du Cryptage
- **ID** : UT-003-03
- **Description** : Vérifie que deux cryptages successifs produisent des résultats différents
- **Entrée** : "test" (crypté deux fois)
- **Sortie Attendue** : Deux chaînes cryptées différentes
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

## Cas de Test pour decrypt

### TC-004 : Décryptage de Base
- **ID** : UT-003-04
- **Description** : Vérifie qu'une chaîne cryptée peut être décryptée correctement
- **Entrée** : Sortie de encrypt("test")
- **Sortie Attendue** : "test"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-005 : Décryptage de Caractères Spéciaux
- **ID** : UT-003-05
- **Description** : Teste le décryptage d'une chaîne contenant des caractères spéciaux
- **Entrée** : Sortie de encrypt("Test@123!#+éèê")
- **Sortie Attendue** : "Test@123!#+éèê"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-006 : Gestion des Erreurs de Format
- **ID** : UT-003-06
- **Description** : Vérifie la gestion des entrées mal formatées
- **Entrée** : "malformatted_string"
- **Sortie Attendue** : Une erreur est levée
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

## Cas de Test pour processUserData

### TC-007 : Traitement des Données Utilisateur
- **ID** : UT-003-07
- **Description** : Vérifie que les données utilisateur sont correctement cryptées
- **Entrée** : Objet utilisateur avec données brutes
- **Sortie Attendue** : Objet utilisateur avec données cryptées
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-008 : Traitement des Dates
- **ID** : UT-003-08
- **Description** : Vérifie que les dates de naissance sont correctement traitées
- **Entrée** : Utilisateur avec date de naissance
- **Sortie Attendue** : Date cryptée au format chaîne
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-009 : Hachage du Mot de Passe
- **ID** : UT-003-09
- **Description** : Vérifie que le mot de passe est correctement haché
- **Entrée** : Utilisateur avec mot de passe "password123!"
- **Sortie Attendue** : Mot de passe haché avec bcrypt
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

## Cas de Test pour processRefreshToken

### TC-010 : Cryptage des Données de Connexion
- **ID** : UT-003-10
- **Description** : Vérifie que l'IP et l'user-agent sont cryptés
- **Entrée** : Objet avec IP et user-agent
- **Sortie Attendue** : Objet avec IP et user-agent cryptés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-011 : Validation du Format MongoDB ID
- **ID** : UT-003-11
- **Description** : Vérifie que le userId est au format MongoDB ID valide
- **Entrée** : Objet avec userId valide et invalide
- **Sortie Attendue** : Validation réussie pour ID valide, erreur pour ID invalide
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

## Cas de Test pour decryptData

### TC-012 : Décryptage des Données Utilisateur
- **ID** : UT-003-12
- **Description** : Vérifie que les champs spécifiés sont correctement décryptés
- **Entrée** : Utilisateur avec données cryptées, liste de champs à décrypter
- **Sortie Attendue** : Utilisateur avec champs spécifiés décryptés
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-013 : Conversion des Dates
- **ID** : UT-003-13
- **Description** : Vérifie que les dates cryptées sont reconverties en objets Date
- **Entrée** : Utilisateur avec date cryptée, ["birthDate"] comme champ à décrypter
- **Sortie Attendue** : Date décryptée convertie en objet Date
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-014 : Gestion des Erreurs de Décryptage
- **ID** : UT-003-14
- **Description** : Vérifie la gestion gracieuse des erreurs de décryptage
- **Entrée** : Utilisateur avec valeur invalide, champs à décrypter
- **Sortie Attendue** : Valeur de substitution pour le champ problématique
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

## Implémentation des Tests

```typescript
import { encrypt, decrypt, processUserData, processRefreshToken, decryptData } from "@utils/encryption.ts"
import { User, RefreshToken } from "@models/index.ts"
import { FIELD } from "@configs/fields.configs.ts"
import bcrypt from "bcrypt"
import mongoose from "mongoose"

describe("encrypt", () => {
  // Test for basic encryption
  it("should encrypt a simple string correctly", () => {
    const result = encrypt("test")
    // Check format - should contain IV and encrypted data separated by ":"
    expect(result).toContain(":")
    const parts = result.split(":")
    expect(parts.length).toBe(2)
    // Both parts should be hex strings
    expect(/^[0-9a-f]+$/.test(parts[0])).toBe(true)
    expect(/^[0-9a-f]+$/.test(parts[1])).toBe(true)
  })

  // Test for complex string encryption
  it("should encrypt a string with special characters", () => {
    const result = encrypt("Test@123!#+éèê")
    expect(result).toContain(":")
  })

  // Test for encryption consistency
  it("should generate different encrypted results for the same input", () => {
    const result1 = encrypt("test")
    const result2 = encrypt("test")
    // Different IVs should produce different encrypted results
    expect(result1).not.toBe(result2)
  })
})

describe("decrypt", () => {
  // Test for basic decryption
  it("should decrypt an encrypted string correctly", () => {
    const original = "test"
    const encrypted = encrypt(original)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(original)
  })

  // Test for decryption of special characters
  it("should correctly decrypt strings with special characters", () => {
    const original = "Test@123!#+éèê"
    const encrypted = encrypt(original)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(original)
  })

  // Test for error handling with malformed input
  it("should throw an error for malformed input", () => {
    expect(() => decrypt("malformatted_string")).toThrow()
  })
})

describe("processUserData", () => {
  // Mock implementations
  jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashed_password")
  }))
  
  jest.mock("@models/index", () => ({
    User: jest.fn().mockImplementation((data) => data)
  }))

  // Test for processing user data
  it("should process and encrypt user data correctly", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123!",
      name: "Doe",
      firstName: "John",
      birthDate: new Date(1990, 0, 1)
    }
    
    const result = await processUserData(userData)
    
    // Check if sensitive fields are encrypted
    expect(result.name).not.toBe(userData.name)
    expect(result.name).toContain(":")
    
    expect(result.firstName).not.toBe(userData.firstName)
    expect(result.firstName).toContain(":")
    
    expect(result.birthDate).not.toBe(userData.birthDate)
    expect(result.birthDate).toContain(":")
    
    // Check if password is hashed
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10)
    expect(result.password).toBe("hashed_password")
    
    // Email should remain unencrypted
    expect(result.email).toBe(userData.email)
  })
})

describe("processRefreshToken", () => {
  // Mock implementations
  jest.mock("@models/index", () => ({
    RefreshToken: jest.fn().mockImplementation((data) => data)
  }))

  // Test for processing refresh token
  it("should encrypt IP and user agent in refresh token", async () => {
    const validMongoId = new mongoose.Types.ObjectId().toString()
    const tokenData = {
      refreshToken: "token123",
      userId: validMongoId,
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0"
    }
    
    const result = await processRefreshToken(tokenData)
    
    // Check if sensitive fields are encrypted
    expect(result.ipAddress).not.toBe(tokenData.ipAddress)
    expect(result.ipAddress).toContain(":")
    
    expect(result.userAgent).not.toBe(tokenData.userAgent)
    expect(result.userAgent).toContain(":")
    
    // Token and userId should remain unencrypted
    expect(result.refreshToken).toBe(tokenData.refreshToken)
    expect(result.userId).toBe(tokenData.userId)
  })
  
  // Test for MongoDB ID validation
  it("should validate that userId is a valid MongoDB ID", async () => {
    const invalidId = "invalid-id-format"
    const tokenData = {
      refreshToken: "token123",
      userId: invalidId,
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0"
    }
    
    // Should throw error for invalid MongoDB ID
    await expect(processRefreshToken(tokenData)).rejects.toThrow()
    
    // Test with valid ID format
    const validId = new mongoose.Types.ObjectId().toString()
    const validTokenData = { ...tokenData, userId: validId }
    
    // Should not throw error for valid MongoDB ID
    await expect(processRefreshToken(validTokenData)).resolves.toBeDefined()
  })
})

describe("decryptData", () => {
  // Test for decrypting user data
  it("should decrypt specified fields in user data", () => {
    // Create user with encrypted fields
    const name = encrypt("Doe")
    const firstName = encrypt("John")
    const birthDate = encrypt("1990-01-01T00:00:00.000Z")
    
    const userData = {
      email: "test@example.com",
      name,
      firstName,
      birthDate
    }
    
    const result = decryptData(userData, [FIELD.NAME, FIELD.FIRST_NAME, FIELD.BIRTH_DATE])
    
    // Check if fields are properly decrypted
    expect(result.name).toBe("Doe")
    expect(result.firstName).toBe("John")
    expect(result.birthDate instanceof Date).toBe(true)
    
    // Unencrypted fields should remain unchanged
    expect(result.email).toBe(userData.email)
  })
  
  // Test for handling decryption errors
  it("should handle decryption errors gracefully", () => {
    // Create user with invalid encrypted field
    const userData = {
      name: "invalid-encrypted-value",
      email: "test@example.com"
    }
    
    // Mock console.error to prevent test output clutter
    jest.spyOn(console, "error").mockImplementation(() => {})
    
    const result = decryptData(userData, [FIELD.NAME])
    
    // Should provide a placeholder for the failed field
    expect(result.name).toBe("[Encrypted name]")
    
    // Unencrypted fields should remain unchanged
    expect(result.email).toBe(userData.email)
  })
})
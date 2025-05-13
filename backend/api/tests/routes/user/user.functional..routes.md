# Documentation des Tests Fonctionnels du Controller User

## Aperçu

Cette suite de tests fonctionnels vérifie le cycle de vie complet d'un utilisateur dans le système, y compris l'authentification administrateur, la gestion des utilisateurs, les opérations utilisateur standard et le nettoyage final. Les tests utilisent une base de données MongoDB en mémoire et s'exécutent sans mocker les composants internes pour garantir un comportement cohérent en conditions réelles.

## Objectif des Tests

Ces tests fonctionnels servent à :

- Vérifier le flux complet des opérations utilisateur de bout en bout
- Tester les interactions entre différents rôles d'utilisateurs (administrateur et utilisateur standard)
- Valider l'authentification, l'autorisation et la gestion des tokens
- S'assurer de la persistance correcte des données en base de données
- Vérifier le nettoyage approprié des ressources (tokens de rafraîchissement, utilisateurs)

## Cas de Test

### TC-001 : Authentification administrateur

- **ID** : FT-001-01
- **Description** : Vérifie qu'un administrateur pré-inséré peut se connecter au système
- **Entrée** : Identifiants administrateur (email et mot de passe)
- **Sortie Attendue** : 
 * Statut 200 (OK)
 * Réponse contenant les tokens d'accès et de rafraîchissement valides
- **Vérifications Spécifiques** :
 * Format JWT des tokens
 * Structure de la réponse API
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

### TC-002 : Création d'utilisateur par l'administrateur

- **ID** : FT-001-02
- **Description** : Vérifie qu'un administrateur peut créer un nouvel utilisateur standard
- **Entrée** : Données utilisateur (email, mot de passe, nom, prénom, date de naissance, rôle)
- **Sortie Attendue** : 
 * Statut 201 (Created)
 * Données de l'utilisateur créé
- **Vérifications Spécifiques** :
 * Correspondance des données retournées avec les données soumises
 * Attribution correcte de l'ID utilisateur
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

### TC-001 : Récupération des utilisateurs par l'administrateur

- **ID** : FT-001-03
- **Description** : Vérifie qu'un administrateur peut récupérer la liste de tous les utilisateurs
- **Entrée** : Token d'accès administrateur
- **Sortie Attendue** : 
 * Statut 200 (OK)
 * Liste des utilisateurs incluant l'administrateur et l'utilisateur standard créé
- **Vérifications Spécifiques** :
 * Présence des utilisateurs de test dans la liste
 * Structure correcte de la réponse
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

### TC-004 : Authentification utilisateur standard

- **ID** : FT-001-04
- **Description** : Vérifie qu'un utilisateur standard peut se connecter avec ses identifiants
- **Entrée** : Identifiants utilisateur standard (email et mot de passe)
- **Sortie Attendue** : 
 * Statut 200 (OK)
 * Tokens d'accès et de rafraîchissement valides
- **Vérifications Spécifiques** :
 * Structure de la réponse API
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

### TC-005 : Mise à jour du profil utilisateur

- **ID** : FT-001-05
- **Description** : Vérifie qu'un utilisateur peut mettre à jour son propre profil
- **Entrée** : Token d'accès utilisateur standard et données de mise à jour (nom et prénom)
- **Sortie Attendue** : 
 * Statut 200 (OK)
 * Données utilisateur mises à jour
 * Nouveaux tokens générés
- **Vérifications Spécifiques** :
 * Correspondance des données mises à jour
 * Structure correcte de la réponse incluant utilisateur et tokens
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

### TC-006 : Déconnexion de l'utilisateur standard

- **ID** : FT-001-06
- **Description** : Vérifie qu'un utilisateur standard peut se déconnecter en invalidant son token de rafraîchissement
- **Entrée** : Token de rafraîchissement utilisateur
- **Sortie Attendue** : 
 * Statut 200 (OK)
 * Message de déconnexion réussie
- **Vérifications Spécifiques** :
 * Suppression du token de rafraîchissement de la base de données
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

### TC-007 : Suppression d'utilisateur par l'administrateur

- **ID** : FT-001-07
- **Description** : Vérifie qu'un administrateur peut supprimer un utilisateur standard
- **Entrée** : Token d'accès administrateur et ID de l'utilisateur à supprimer
- **Sortie Attendue** : 
 * Statut 200 (OK)
 * Message de suppression réussie
- **Vérifications Spécifiques** :
 * Suppression effective de l'utilisateur de la base de données
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

### TC-008 : Déconnexion de l'administrateur

- **ID** : FT-001-08
- **Description** : Vérifie qu'un administrateur peut se déconnecter en invalidant son token de rafraîchissement
- **Entrée** : Token de rafraîchissement administrateur
- **Sortie Attendue** : 
 * Statut 200 (OK)
 * Message de déconnexion réussie
- **Vérifications Spécifiques** :
 * Suppression du token de rafraîchissement de la base de données
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-13

## Méthodologie

Ces tests utilisent une approche fonctionnelle complète :

- Interaction avec une base de données MongoDB en mémoire pour des tests réalistes
- Exécution séquentielle des tests pour vérifier le flux complet des opérations
- Tests groupés logiquement par fonctionnalité et rôle utilisateur
- Vérification de l'état de la base de données après chaque opération critique
- Conservation des données entre les tests pour maintenir le contexte du flux utilisateur

## Points techniques importants

- Insertion directe d'un administrateur avec données chiffrées pour initialiser les tests
- Vérification des tokens JWT et de leur format
- Validation approfondie des réponses API et de leur structure
- Nettoyage complet des données après la fin des tests
- Utilisation de variables partagées entre les tests pour maintenir l'état
- Gestion du chiffrement des données sensibles dans la base de données

## Implémentation des Tests

```typescript
import { SUCCESS_MESSAGE, SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { User, RefreshToken } from "@models/index.ts"
import { FIELD } from "@configs/fields.configs.ts"
import { encrypt } from "@utils/crypto.ts"
import request from "supertest"
import app from "@core/app.ts"
import bcrypt from "bcrypt"

describe("User API Functional Tests", () => {
 // Test data setup
 const adminUser = {
   email: "admin-test@example.com",
   password: "AdminPassword123!",
   name: "Admin",
   firstName: "Test",
   birthDate: "1990-01-01",
   role: "administrator",
   active: true,
 }

 const testUser = {
   email: "functional-test@example.com",
   password: "Password123!",
   name: "Functional",
   firstName: "Test",
   birthDate: "1994-06-14",
   role: "user",
 }

 const updatedUserData = {
   name: "UpdatedName",
   firstName: "UpdatedFirstName",
 }

 // Shared tokens and IDs
 let adminAccessToken: string
 let adminRefreshToken: string
 let userAccessToken: string
 let userRefreshToken: string
 let userId: string

 // Test setup and teardown
 beforeAll(async () => {
   // Insert admin user directly into the database
   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(adminUser.password, salt)
   
   await User.create({
     email: adminUser.email,
     password: hashedPassword,
     name: encrypt(adminUser.name),
     firstName: encrypt(adminUser.firstName),
     birthDate: encrypt(adminUser.birthDate),
     role: adminUser.role,
     active: adminUser.active,
     createdAt: new Date(),
     updatedAt: new Date(),
   })
 })

 afterAll(async () => {
   // Clean up all test data
   await User.deleteMany({
     email: {
       $in: [testUser.email, adminUser.email],
     },
   })
   await RefreshToken.deleteMany({})
 })

 // Group 1: Administrator Authentication
 describe("1. Admin Authentication", () => {
   it("should login with the pre-inserted admin user", async () => {
     // Test implementation
   })
 })

 // Group 2: User Management
 describe("2. Admin User Management", () => {
   it("should create a standard user using admin privileges", async () => {
     // Test implementation
   })

   it("should retrieve all users as admin", async () => {
     // Test implementation
   })
 })

 // Group 3: Standard User Operations
 describe("3. Standard User Operations", () => {
   it("should login with the created standard user", async () => {
     // Test implementation
   })

   it("should update standard user profile", async () => {
     // Test implementation
   })

   it("should logout the standard user", async () => {
     // Test implementation
   })
 })

 // Group 4: Admin Cleanup Operations
 describe("4. Admin Cleanup", () => {
   it("should delete the standard user as admin", async () => {
     // Test implementation
   })

   it("should logout the admin user", async () => {
     // Test implementation
   })
 })
})
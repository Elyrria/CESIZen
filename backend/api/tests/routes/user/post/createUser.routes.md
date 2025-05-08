# Documentation des Tests Fonctionnels de la route de création d'un User

## Aperçu

Cette suite de tests fonctionnels vérifie que les fonctionnalités liées à la création d'utilisateur fonctionnent correctement de bout en bout, sans mock, avec une persistance réelle en base de données, et en validant la structure complète de la réponse API.

## Objectif des Tests

Ces tests fonctionnels servent à :

- Vérifier que le système complet fonctionne comme prévu
- S'assurer que les données sont correctement enregistrées en base de données
- Valider la structure et le contenu des réponses API
- Vérifier la sécurité des données sensibles (hachage des mots de passe, non-exposition dans les réponses)
- Confirmer la génération correcte des tokens d'authentification
- Tester l'application dans un environnement proche de la production

## Cas de Test

### TC-001 : Création d'utilisateur avec validation complète de la réponse API et de la persistance

- **ID** : FT-003-01
- **Description** : Vérifie qu'un utilisateur peut être créé via l'API, que la réponse contient toutes les données attendues correctement formatées, et que l'utilisateur est correctement persisté en base de données
- **Entrée** : Requête POST avec données utilisateur complètes (email, mot de passe, nom, prénom, date de naissance, rôle)
- **Sortie Attendue** : 
 * Statut 201 (Created)
 * Réponse API avec structure correcte (success, code, message, data)
 * Données utilisateur complètes et correctes dans la réponse (sans le mot de passe)
 * Tokens JWT valides
 * Utilisateur persisté en base de données avec mot de passe haché
- **Vérifications Spécifiques** :
 * Structure de la réponse API complète
 * Présence et exactitude de toutes les données utilisateur
 * Absence du mot de passe dans la réponse API
 * Format JWT valide pour les tokens
 * Persistance en base de données
 * Hachage du mot de passe
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Méthodologie

Ces tests utilisent une approche fonctionnelle complète :
- Tests effectués via des requêtes HTTP réelles avec SuperTest
- Utilisation d'une base de données MongoDB en mémoire dédiée aux tests
- Aucun mock des fonctionnalités de l'application
- Vérification de la structure et du contenu des réponses API
- Validation de la persistance et de la sécurité des données en base de données

## Points techniques importants

- Nettoyage des données après chaque test (utilisateur et tokens de rafraîchissement)
- Vérification de la structure complète de la réponse API
- Validation du format JWT des tokens
- Contrôle de sécurité (absence du mot de passe dans la réponse, hachage en BDD)
- Test de l'application dans un environnement comparable à la production

## Implémentation des Tests

```typescript
import { SUCCESS_MESSAGE, SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { User, RefreshToken } from "@models/index.ts"
import { FIELD } from "@configs/fields.configs.ts"
import request from "supertest"
import app from "@core/app.ts"

describe("User createUser Route Functional Tests", () => {
   const newUser = {
   	email: "functional-test@example.com",
   	password: "Password123!",
   	name: "Functional",
   	firstName: "Test",
   	birthDate: "1994-06-14",
   	role: "user",
   }

   afterEach(async () => {
   	// Retrieve the user to get their ID
   	const user = await User.findOne({ email: newUser.email })
   	if (user) {
   		await RefreshToken.deleteMany({ userId: user._id })
   	}
   	// Delete the user
   	await User.deleteMany({ email: newUser.email })
   })

   it("should create a new user successfully and persist it in the database", async () => {
   	// Send a POST request to the user creation endpoint
   	const response = await request(app).post("/api/v1/users/create").send(newUser)

   	// Verify that the status is 201 (Created)
   	expect(response.status).toBe(201)

   	// Verify the basic structure of the response
   	expect(response.body).toHaveProperty("success", true)
   	expect(response.body).toHaveProperty("code", SUCCESS_CODE.USER_CREATED)
   	expect(response.body).toHaveProperty("message", SUCCESS_MESSAGE.USER_CREATED)
   	expect(response.body).toHaveProperty("data")
   	expect(response.body.data).toHaveProperty("user")
   	
   	const user = response.body.data.user
   	expect(user).toHaveProperty(FIELD.EMAIL, newUser.email)
   	expect(user).toHaveProperty(FIELD.NAME, newUser.name)
   	expect(user).toHaveProperty(FIELD.FIRST_NAME, newUser.firstName)
   	expect(user).toHaveProperty(FIELD.ROLE, newUser.role)
   	expect(user).toHaveProperty("active", true)
   	expect(user).toHaveProperty("id") // Verify the presence of the ID
   	
   	// Verify that the response doesn't expose the password
   	expect(user).not.toHaveProperty(FIELD.PASSWORD)
   	
   	// Verify the structure and content of data.tokens
   	expect(response.body.data).toHaveProperty("tokens")
   	const tokens = response.body.data.tokens
   	
   	expect(tokens).toHaveProperty(FIELD.ACCESS_TOKEN)
   	expect(tokens).toHaveProperty(FIELD.REFRESH_TOKEN)
   	
   	// Verify that tokens are valid JWTs
   	expect(tokens.accessToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)
   	expect(tokens.refreshToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)
   	
   	// Verify that the user has been properly persisted in the database
   	const createdUser = await User.findOne({ email: newUser.email })
   	expect(createdUser).not.toBeNull()
   	
   	// Verify that the password has been properly hashed (should not be in plain text)
   	expect(createdUser!.password).not.toBe(newUser.password)
   })
})
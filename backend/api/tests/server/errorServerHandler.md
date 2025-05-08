# Documentation de Test : Fonction errorServerHandler

## Aperçu
Ce module fournit une fonction pour gérer les erreurs lors du démarrage d'un serveur HTTP. Il détecte les types d'erreurs courants et fournit des messages d'erreur explicites avant de terminer le processus si nécessaire.

## Objectif de la Fonction

### errorServerHandler
La fonction `errorServerHandler` sert à :
- Intercepter et traiter les erreurs liées au démarrage d'un serveur HTTP
- Fournir des messages d'erreur spécifiques pour les problèmes d'accès et d'occupation de port
- Terminer proprement le processus en cas d'erreur critique
- Propager les autres types d'erreurs pour qu'elles soient traitées ailleurs

## Comportements Spécifiques
La fonction gère spécifiquement les codes d'erreur suivants :
- `EACCES` : Problème de privilèges insuffisants pour accéder au port
- `EADDRINUSE` : Port déjà utilisé par un autre processus
- Autres erreurs : Elles sont propagées vers le gestionnaire d'erreurs supérieur

## Cas de Test

### TC-001 : Gestion d'une Erreur Non Liée à l'Écoute
- **ID** : UT-007-01
- **Description** : Vérifie que la fonction propage les erreurs non liées à l'écoute du serveur
- **Entrée** : Erreur avec syscall différent de "listen"
- **Sortie Attendue** : L'erreur est propagée (throw)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Gestion du Code d'Erreur EACCES
- **ID** : UT-007-02
- **Description** : Vérifie que la fonction gère correctement les erreurs de privilèges
- **Entrée** : Erreur avec code "EACCES"
- **Sortie Attendue** : Message d'erreur spécifique et appel à process.exit(1)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Gestion du Code d'Erreur EADDRINUSE
- **ID** : UT-007-03
- **Description** : Vérifie que la fonction gère correctement les erreurs de port déjà utilisé
- **Entrée** : Erreur avec code "EADDRINUSE"
- **Sortie Attendue** : Message d'erreur spécifique et appel à process.exit(1)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Gestion d'un Code d'Erreur Non Géré
- **ID** : UT-007-04
- **Description** : Vérifie que la fonction propage les erreurs avec des codes non spécifiquement gérés
- **Entrée** : Erreur avec code non reconnu
- **Sortie Attendue** : L'erreur est propagée (throw)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-005 : Formatage d'Adresse de Type String
- **ID** : UT-007-05
- **Description** : Vérifie que la fonction formate correctement les adresses de type chaîne
- **Entrée** : Adresse de serveur de type string
- **Sortie Attendue** : Message formaté avec "pipe [adresse]"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Formatage d'Adresse de Type Objet
- **ID** : UT-007-06
- **Description** : Vérifie que la fonction formate correctement les adresses de type objet
- **Entrée** : Adresse de serveur de type objet avec port
- **Sortie Attendue** : Message formaté avec "Port [port]"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Implémentation des Tests

```typescript
import http from "http"
import { errorServerHandler } from "@server/errorServerHandler.ts"

// Create a mock for process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`process.exit called with "${code}"`);
});

// Mock for console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe("errorServerHandler", () => {
	let mockServer: http.Server
	let mockError: NodeJS.ErrnoException

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks()

		// Create a mock of the HTTP server
		mockServer = {
			address: jest.fn(),
		} as unknown as http.Server

		// Create a mock error
		mockError = new Error() as NodeJS.ErrnoException
		mockError.syscall = "listen"
	})

	afterAll(() => {
		// Restore mocks after all tests
		mockExit.mockRestore()
		mockConsoleError.mockRestore()
	})

	// Test for errors not related to listening
	it("should throw error if syscall is not listen", () => {
		mockError.syscall = "connect"

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow(mockError)
	})

	// Test for EACCES error code
	it("should handle EACCES error correctly", () => {
		mockError.code = "EACCES"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("requires elevated privileges"))
		expect(mockExit).toHaveBeenCalledWith(1)
	})

	// Test for EADDRINUSE error code
	it("should handle EADDRINUSE error correctly", () => {
		mockError.code = "EADDRINUSE"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("is already in use"))
		expect(mockExit).toHaveBeenCalledWith(1)
	})

	// Test for unhandled error codes
	it("should throw other errors", () => {
		mockError.code = "UNKNOWN_ERROR"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow(mockError)
	})

	// Test for string address formatting
	it("should format string address correctly", () => {
		mockError.code = "EACCES"
		const socketPath = "/tmp/socket"
		mockServer.address = jest.fn().mockReturnValue(socketPath)

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining(`pipe ${socketPath}`))
	})

	// Test for object address formatting
	it("should format object address correctly", () => {
		mockError.code = "EACCES"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("Port"))
	})
})
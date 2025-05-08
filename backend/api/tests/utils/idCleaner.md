# Documentation de Test : Fonction deleteObjectIds

## Aperçu
Ce module fournit une fonction utilitaire pour supprimer les identifiants courants d'un objet. Cette fonction est particulièrement utile lors du traitement de données avant stockage ou lors de la comparaison d'objets où les identifiants ne sont pas pertinents.

## Objectif de la Fonction

### deleteObjectIds
La fonction `deleteObjectIds` sert à :
- Supprimer les identifiants courants d'un objet (`id`, `userId`, `_id`, `uuid`)
- Créer une copie de l'objet original sans modifier ce dernier
- Retourner la nouvelle version de l'objet sans les identifiants spécifiés

## Cas de Test

### TC-001 : Suppression d'un ID Simple
- **ID** : UT-005-01
- **Description** : Vérifie que la fonction supprime correctement un champ 'id' d'un objet
- **Entrée** : `{ id: '123', name: 'Test' }`
- **Sortie Attendue** : `{ name: 'Test' }`
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-002 : Suppression de Plusieurs Types d'IDs
- **ID** : UT-005-02
- **Description** : Vérifie que la fonction supprime tous les types d'identifiants spécifiés
- **Entrée** : `{ id: '123', _id: '456', userId: '789', uuid: 'abc', name: 'Test' }`
- **Sortie Attendue** : `{ name: 'Test' }`
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-003 : Absence d'IDs à Supprimer
- **ID** : UT-005-03
- **Description** : Vérifie que la fonction retourne l'objet intact quand aucun ID n'est présent
- **Entrée** : `{ name: 'Test', value: 42 }`
- **Sortie Attendue** : `{ name: 'Test', value: 42 }`
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-004 : Préservation de l'Objet Original
- **ID** : UT-005-04
- **Description** : Vérifie que la fonction ne modifie pas l'objet original
- **Entrée** : `const original = { id: '123', name: 'Test' } deleteObjectIds(original)`
- **Sortie Attendue** : `original` reste `{ id: '123', name: 'Test' }`
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-005 : Gestion d'un Objet Vide
- **ID** : UT-005-05
- **Description** : Vérifie que la fonction gère correctement un objet vide
- **Entrée** : `{}`
- **Sortie Attendue** : `{}`
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

### TC-006 : Gestion des Objets Imbriqués
- **ID** : UT-005-06
- **Description** : Vérifie que la fonction ne modifie que les propriétés de premier niveau
- **Entrée** : `{ id: '123', nested: { id: '456', name: 'Nested' } }`
- **Sortie Attendue** : `{ nested: { id: '456', name: 'Nested' } }`
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-08

## Implémentation des Tests

```typescript
import { deleteObjectIds } from "@utils/idCleaner.ts"

describe("deleteObjectIds", () => {
  // Test for removing a simple ID
  it("should remove a single id field from an object", () => {
    const input = { id: '123', name: 'Test' }
    const result = deleteObjectIds(input)
    
    expect(result).toEqual({ name: 'Test' })
    expect('id' in result).toBe(false)
  })

  // Test for removing multiple types of IDs
  it("should remove all specified ID types from an object", () => {
    const input = { 
      id: '123', 
      _id: '456', 
      userId: '789', 
      uuid: 'abc', 
      name: 'Test' 
    }
    const result = deleteObjectIds(input)
    
    expect(result).toEqual({ name: 'Test' })
    expect('id' in result).toBe(false)
    expect('_id' in result).toBe(false)
    expect('userId' in result).toBe(false)
    expect('uuid' in result).toBe(false)
  })

  // Test for absence of IDs to remove
  it("should return object unchanged when no IDs are present", () => {
    const input = { name: 'Test', value: 42 }
    const result = deleteObjectIds(input)
    
    expect(result).toEqual(input)
  })

  // Test for preserving the original object
  it("should not modify the original object", () => {
    const original = { id: '123', name: 'Test' }
    const result = deleteObjectIds(original)
    
    expect(original).toEqual({ id: '123', name: 'Test' })
    expect(result).not.toBe(original) // Verifies it's not the same reference
  })

  // Test for handling an empty object
  it("should handle empty objects", () => {
    const input = {}
    const result = deleteObjectIds(input)
    
    expect(result).toEqual({})
  })

  // Test for handling nested objects
  it("should only modify top-level properties", () => {
    const input = { 
      id: '123', 
      nested: { id: '456', name: 'Nested' } 
    }
    const result = deleteObjectIds(input)
    
    expect(result).toEqual({ 
      nested: { id: '456', name: 'Nested' } 
    })
  })
})
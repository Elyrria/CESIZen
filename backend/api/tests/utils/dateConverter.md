# Documentation de Test : Fonctions de Conversion de Date

## Aperçu
Les fonctions `dateToString` et `stringToDate` sont des utilitaires conçus pour faciliter la conversion entre objets Date et chaînes de caractères. Ces fonctions sont particulièrement utiles lors des opérations d'encryption/décryption de données où les dates doivent être standardisées.

## Objectif des Fonctions

### dateToString
La fonction `dateToString` sert à :
- Convertir divers formats de date (Date, string, number) en chaîne de caractères standardisée
- Gérer correctement les cas particuliers (undefined, null)
- Conserver les chaînes de caractères déjà valides sans modification

### stringToDate
La fonction `stringToDate` sert à :
- Reconvertir une chaîne de caractères en objet Date lorsque possible
- Préserver la valeur originale lorsque la conversion n'est pas possible
- Gérer les erreurs sans interruption du flux d'exécution

## Cas de Test pour dateToString

### TC-001 : Conversion d'un Objet Date
- **ID** : UT-002-01
- **Description** : Vérifie qu'un objet Date est correctement converti en chaîne ISO
- **Entrée** : `new Date(2023, 5, 15, 10, 30, 0)`
- **Sortie Attendue** : Chaîne au format ISO (via toISOString())
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-002 : Gestion des Chaînes de Date Valides
- **ID** : UT-002-02
- **Description** : Confirme que les chaînes de date valides sont conservées telles quelles
- **Entrée** : "2023-06-15T10:30:00.000Z"
- **Sortie Attendue** : "2023-06-15T10:30:00.000Z" (inchangée)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-003 : Gestion des Chaînes Non Valides
- **ID** : UT-002-03
- **Description** : Vérifie que les chaînes qui ne sont pas des dates sont conservées telles quelles
- **Entrée** : "ceci n'est pas une date"
- **Sortie Attendue** : "ceci n'est pas une date" (inchangée)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-004 : Conversion d'un Timestamp
- **ID** : UT-002-04
- **Description** : Teste la conversion d'un timestamp numérique en chaîne ISO
- **Entrée** : 1623752400000
- **Sortie Attendue** : Chaîne ISO équivalente à cette date
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-005 : Gestion de Undefined
- **ID** : UT-002-05
- **Description** : Vérifie le comportement avec une valeur undefined
- **Entrée** : undefined
- **Sortie Attendue** : "" (chaîne vide)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-006 : Gestion de Null
- **ID** : UT-002-06
- **Description** : Vérifie le comportement avec une valeur null
- **Entrée** : null
- **Sortie Attendue** : "" (chaîne vide)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

## Cas de Test pour stringToDate

### TC-007 : Conversion d'une Chaîne de Date Valide
- **ID** : UT-002-07
- **Description** : Vérifie qu'une chaîne de date valide est convertie en objet Date
- **Entrée** : "2023-06-15T10:30:00.000Z"
- **Sortie Attendue** : Objet Date équivalent
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-008 : Gestion des Chaînes Non Valides
- **ID** : UT-002-08
- **Description** : Confirme que les chaînes non valides sont retournées sans modification
- **Entrée** : "ceci n'est pas une date"
- **Sortie Attendue** : "ceci n'est pas une date" (inchangée)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-009 : Gestion des Chaînes Vides
- **ID** : UT-002-09
- **Description** : Teste le comportement avec une chaîne vide
- **Entrée** : ""
- **Sortie Attendue** : "" (chaîne vide inchangée)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-010 : Gestion de Différents Formats de Date
- **ID** : UT-002-10
- **Description** : Vérifie la compatibilité avec différents formats de date valides
- **Entrée** : ["2023-06-15", "06/15/2023", "June 15, 2023"]
- **Sortie Attendue** : Objets Date pour chaque entrée
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

### TC-011 : Gestion des Erreurs
- **ID** : UT-002-11
- **Description** : Confirme que les erreurs sont gérées sans interruption
- **Entrée** : "2023-06-15" (avec Date modifié pour lever une erreur)
- **Sortie Attendue** : "2023-06-15" (chaîne originale retournée)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 06-05-2025

## Implémentation des Tests

```typescript
import { dateToString, stringToDate } from "@utils/dateConverter";

describe("dateToString", () => {
  // Test for Date objects
  it("should convert a Date object to ISO string", () => {
    const testDate = new Date(2023, 5, 15, 10, 30, 0); // June 15, 2023 10:30:00
    const result = dateToString(testDate);
    expect(result).toBe(testDate.toISOString());
  });

  // Test for valid string dates
  it("should return the string as is if it's a valid date", () => {
    const dateStr = "2023-06-15T10:30:00.000Z";
    const result = dateToString(dateStr);
    expect(result).toBe(dateStr);
  });

  // Test for invalid string dates
  it("should return the string as is if it's not a valid date", () => {
    const invalidStr = "this is not a date";
    const result = dateToString(invalidStr);
    expect(result).toBe(invalidStr);
  });

  // Test for numbers (timestamps)
  it("should convert a timestamp to ISO string", () => {
    const timestamp = 1623752400000; // equivalent to a specific date
    const result = dateToString(timestamp);
    expect(result).toBe(new Date(timestamp).toISOString());
  });

  // Test for undefined
  it("should return an empty string for undefined", () => {
    const result = dateToString(undefined);
    expect(result).toBe("");
  });

  // Test for null
  it("should return an empty string for null", () => {
    // @ts-ignore - Ignoring TypeScript error as we're explicitly testing null
    const result = dateToString(null);
    expect(result).toBe("");
  });
});

describe("stringToDate", () => {
  // Silence console warnings during tests
  let originalConsoleWarn: typeof console.warn;
  
  beforeEach(() => {
    // Store the original console.warn method
    originalConsoleWarn = console.warn;
    // Replace it with a jest mock function
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    // Restore the original console.warn after each test
    console.warn = originalConsoleWarn;
  });

  // Test for a valid date string
  it("should convert a valid date string to Date object", () => {
    const dateStr = "2023-06-15T10:30:00.000Z";
    const result = stringToDate(dateStr);
    expect(result instanceof Date).toBe(true);
    expect((result as Date).toISOString()).toBe(dateStr);
  });

  // Test for an invalid date string
  it("should return the original string for an invalid date", () => {
    const invalidStr = "this is not a date";
    const result = stringToDate(invalidStr);
    expect(result).toBe(invalidStr);
  });

  // Test for an empty string
  it("should return the empty string for an empty input", () => {
    const result = stringToDate("");
    expect(result).toBe("");
  });

  // Test with different date formats
  it("should handle different valid date formats", () => {
    const formats = [
      "2023-06-15",
      "06/15/2023",
      "June 15, 2023"
    ];

    formats.forEach(format => {
      const result = stringToDate(format);
      expect(result instanceof Date).toBe(true);
    });
  });

  // Test for error handling
  it("should handle errors and return the original string", () => {
    // Simulate an error by temporarily modifying Date
    const originalDate = global.Date;
    // @ts-ignore - To simulate erroneous behavior
    global.Date = function() { throw new Error("Date error"); };

    const result = stringToDate("2023-06-15");
    expect(result).toBe("2023-06-15");
    
    // Verify that the console.warn was called
    expect(console.warn).toHaveBeenCalled();

    // Restore Date
    global.Date = originalDate;
  });
});
import { body } from "express-validator"

/**
 * Configuration des champs pour le système de ticketing
 */
const SUPPORT_FIELD = {
  TYPE: "type",
  PRIORITY: "priority",
  TITLE: "title",
  DESCRIPTION: "description",
  USER_EMAIL: "userEmail"
} as const

/**
 * Configuration des valeurs autorisées
 */
const SUPPORT_CONFIG = {
  TYPE: {
    ALLOWED_VALUES: ["bug", "feature"] as const // bug ET feature
  },
  PRIORITY: {
    ALLOWED_VALUES: ["P1-Critical", "P2-High", "P3-Medium", "P4-Low"] as const
  },
  TITLE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1000
  }
} as const

/**
 * Messages d'erreur pour le système de support
 */
const SUPPORT_MESSAGE = {
  required: (field: string) => `The ${field} field is required`,
  mustBeString: (field: string) => `The ${field} must be a string`,
  length: (field: string, min: number, max: number) =>
    `The ${field} must be between ${min} and ${max} characters`,
  invalidType: () =>
    `The type must be one of the following: ${SUPPORT_CONFIG.TYPE.ALLOWED_VALUES.join(", ")}`,
  invalidPriority: () =>
    `The priority must be one of the following: ${SUPPORT_CONFIG.PRIORITY.ALLOWED_VALUES.join(", ")}`,
  emailInvalid: "The email must be a valid email address"
}

/**
 * Validateurs pour le système de ticketing
 */
export const SUPPORT_VALIDATOR = {
  REQUIRED: {
    /**
     * Validation du type de ticket
     */
    TYPE: () => [
      body(SUPPORT_FIELD.TYPE)
        .exists()
        .withMessage(SUPPORT_MESSAGE.required(SUPPORT_FIELD.TYPE))
        .isString()
        .withMessage(SUPPORT_MESSAGE.mustBeString(SUPPORT_FIELD.TYPE))
        .isIn(SUPPORT_CONFIG.TYPE.ALLOWED_VALUES)
        .withMessage(SUPPORT_MESSAGE.invalidType())
        .escape()
        .trim()
    ],

    /**
     * Validation de la priorité
     */
    PRIORITY: () => [
      body(SUPPORT_FIELD.PRIORITY)
        .exists()
        .withMessage(SUPPORT_MESSAGE.required(SUPPORT_FIELD.PRIORITY))
        .isString()
        .withMessage(SUPPORT_MESSAGE.mustBeString(SUPPORT_FIELD.PRIORITY))
        .isIn(SUPPORT_CONFIG.PRIORITY.ALLOWED_VALUES)
        .withMessage(SUPPORT_MESSAGE.invalidPriority())
        .escape()
        .trim()
    ],

    /**
     * Validation du titre
     */
    TITLE: () => [
      body(SUPPORT_FIELD.TITLE)
        .exists()
        .withMessage(SUPPORT_MESSAGE.required(SUPPORT_FIELD.TITLE))
        .isString()
        .withMessage(SUPPORT_MESSAGE.mustBeString(SUPPORT_FIELD.TITLE))
        .isLength({
          min: SUPPORT_CONFIG.TITLE.MIN_LENGTH,
          max: SUPPORT_CONFIG.TITLE.MAX_LENGTH
        })
        .withMessage(
          SUPPORT_MESSAGE.length(
            SUPPORT_FIELD.TITLE,
            SUPPORT_CONFIG.TITLE.MIN_LENGTH,
            SUPPORT_CONFIG.TITLE.MAX_LENGTH
          )
        )
        .escape()
        .trim()
    ],

    /**
     * Validation de la description
     */
    DESCRIPTION: () => [
      body(SUPPORT_FIELD.DESCRIPTION)
        .exists()
        .withMessage(SUPPORT_MESSAGE.required(SUPPORT_FIELD.DESCRIPTION))
        .isString()
        .withMessage(SUPPORT_MESSAGE.mustBeString(SUPPORT_FIELD.DESCRIPTION))
        .isLength({
          min: SUPPORT_CONFIG.DESCRIPTION.MIN_LENGTH,
          max: SUPPORT_CONFIG.DESCRIPTION.MAX_LENGTH
        })
        .withMessage(
          SUPPORT_MESSAGE.length(
            SUPPORT_FIELD.DESCRIPTION,
            SUPPORT_CONFIG.DESCRIPTION.MIN_LENGTH,
            SUPPORT_CONFIG.DESCRIPTION.MAX_LENGTH
          )
        )
        .escape()
        .trim()
    ],

    /**
     * Validation de l'email utilisateur (optionnel)
     */
    USER_EMAIL: () => [
      body(SUPPORT_FIELD.USER_EMAIL)
        .optional()
        .isEmail()
        .withMessage(SUPPORT_MESSAGE.emailInvalid)
        .normalizeEmail()
        .escape()
        .trim()
    ]
  }
}

export { SUPPORT_FIELD, SUPPORT_CONFIG, SUPPORT_MESSAGE }

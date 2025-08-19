import { SUPPORT_VALIDATOR } from "@api/src/middlewares/validator/schemas/support.validator.schema.ts"

/**
 * Règles de validation pour la création d'un ticket de support
 * Valide les champs requis pour signaler un bug
 *
 * @returns Tableau de règles de validation pour les champs 'type', 'priority', 'title', 'description' et 'userEmail'
 */
export const createTicketValidationRules = [
  ...SUPPORT_VALIDATOR.REQUIRED.TYPE(),
  ...SUPPORT_VALIDATOR.REQUIRED.PRIORITY(),
  ...SUPPORT_VALIDATOR.REQUIRED.TITLE(),
  ...SUPPORT_VALIDATOR.REQUIRED.DESCRIPTION(),
  ...SUPPORT_VALIDATOR.REQUIRED.USER_EMAIL()
]

import type { IInformationDocument } from "@api/types/information.d.ts"
import type { IActivityDocument } from "@api/types/activity.d.ts"
import type { IUserCreate } from "@api/types/user.d.ts"

// Helper function for validating required fields
export function validateRequiredUserFields(user: Partial<IUserCreate>): boolean {
	return Boolean(user.role && user.password && user.email && user.name && user.firstName && user.birthDate)
}

export function validateRequierdInformationFields(information: Partial<IInformationDocument>): boolean {
	return Boolean(information.title && information.descriptionInformation && information.name && information.type)
}

// Fonction de validation pour les champs requis d'une activité
export function validateRequiredActivityFields(activity: Partial<IActivityDocument>): boolean {
	return Boolean(
		activity.name &&
			activity.description &&
			activity.type &&
			activity.categoryId &&
			((activity.type === "TEXT" && activity.content) || activity.type !== "TEXT")
	)
}

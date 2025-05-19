// src/factories/EntityFactory.ts

// Types pour toutes les entités
export type UserRole = "user" | "administrator"
export type InformationType = "TEXT" | "IMAGE" | "VIDEO"
export type InformationStatus = "DRAFT" | "PENDING" | "PUBLISHED"
export type ActivityType = "TEXT" | "VIDEO"

// Interfaces de base
export interface Entity {
	id?: string
    _id?:string
	createdAt?: string
	updatedAt?: string
}

// User
export interface User extends Entity {
	email: string
	name: string
	firstName?: string
	role: UserRole
	birthDate?: string
	active?: boolean
}

// Information
export interface Information extends Entity {
	title: string
	descriptionInformation: string
	name: string
	type: InformationType
	content?: string
	status: InformationStatus
	authorId: string
	categoryId: string[] | { _id: string; name: string; id: string }[]
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	fileId?: string
	fileMetadata?: {
		filename: string
		contentType: string
		size: number
		uploadDate: string
	}
	mediaUrl?: string
	thumbnailUrl?: string
}

// Activity
export interface Activity extends Entity {
	name: string
	descriptionActivity: string
	type: ActivityType
	content?: string
	isActive: boolean
	authorId: string
	categoryId: string[] | { _id: string; name: string; id: string }[]
	parameters?: {
		breathingPatterns?: BreathingPattern[]
		defaultPattern?: string
		recommendedDuration?: number
		benefits?: string[]
		instructions?: {
			before?: string
			during?: string
			after?: string
		}
	}
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	fileId?: string
	fileMetadata?: {
		filename: string
		contentType: string
		size: number
		uploadDate: string
	}
	mediaUrl?: string
	thumbnailUrl?: string
}

// Breathing Pattern
export interface BreathingPattern {
	name: string
	description: string
	inspiration: number
	retention: number
	expiration: number
}

// Category
export interface Category extends Entity {
	name: string
	isActive: boolean
	createdBy?: string
	updatedBy?: string
}

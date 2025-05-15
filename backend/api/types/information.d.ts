import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"
import type { Role } from "@api/types/roles.d.ts"
import type { Document } from "mongoose"
import { mongoose } from "mongoose"

type ObjectId = mongoose.Types.ObjectId

// Définition des types pour les formats de contenu
export type ContentType = (typeof MEDIATYPE)[number]
// Définition des statuts de publication
export type InformationStatus = (typeof STATUS)[number]
/**
 * Interface for file metadata stored in GridFS
 * Contains basic file information and specialized media metadata
 */
export interface IFileMetadata {
	// Basic file information
	filename: string // Original name of the uploaded file
	contentType: string // MIME type of the file (e.g., 'image/jpeg', 'video/mp4')
	size: number // File size in bytes
	uploadDate: Date // Date when the file was uploaded to GridFS

	// Media-specific metadata
	duration?: number // Length of audio/video in seconds
	dimensions?: {
		// Image or video dimensions
		width: number // Width in pixels
		height: number // Height in pixels
	}
	encoding?: string // Audio encoding format (e.g., 'mp3', 'aac', 'wav')
	bitrate?: number // Audio/video bitrate in bits per second
}

/**
 * Main Information interface representing content items in the system
 * Can contain different types of content (text, HTML, media files)
 */
export interface IInformation {
	_id?: ObjectId
	authorId: ObjectId
	title: string
	descriptionInformation: string
	name: string
	type: ContentType
	status: InformationStatus
	validatedBy?: ObjectId
	validatedAndPublishedAt?: Date
	fileId?: ObjectId
	fileMetadata?: Object
	content?: string
	categoryId?: ObjectId
	createdAt?: Date
	updatedAt?: Date
}

/**
 * Extends the IInformation interface with Mongoose Document properties
 * Used for database operations and document instance methods
 */
export interface IInformationDocument extends IInformation, Document {}
// Helper type to identify media types vs text types
export type MediaType = Exclude<ContentType, "TEXT">

export type TransformedInfo = IInformation & {
	mediaUrl?: string
	thumbnailUrl?: string
	id?: string
}

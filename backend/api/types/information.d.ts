import type { Role } from "@api/types/roles.d.ts"
import type { ObjectId, Document } from "mongoose"
import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"

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
	authorId: ObjectId // Reference to the user who created this information
	title: string // Title of the information
	description: string // Brief description or summary
	name: string // Identifier name (can be used for URLs or reference)
	type: ContentType // Content format type (TEXT, HTML, VIDEO, AUDIO, IMAGE)
	status: InformationStatus // Publication status (DRAFT, PENDING, PUBLISHED)
	validatedBy?: ObjectId // Reference to the user who validated/approved this information
	validatedAndPublishedAt?: Date // Timestamp when the information was validated and published

	// GridFS file reference (only for media types: VIDEO, AUDIO, IMAGE)
	fileId?: ObjectId // ID of the associated file in GridFS
	fileMetadata?: IFileMetadata // Metadata of the associated file
	content?: string // Actual text
}

/**
 * Extends the IInformation interface with Mongoose Document properties
 * Used for database operations and document instance methods
 */
export interface IInformationDocument extends IInformation, Document {}
// Helper type to identify media types vs text types
export type MediaType = Exclude<ContentType, "TEXT">;

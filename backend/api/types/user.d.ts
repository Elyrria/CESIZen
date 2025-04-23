import type { Role } from "./roles.d.ts"

/**
 * Base interface for a user
 */
export interface IUser {
    /** User's unique email */
    email?: string;
    /** User's hashed password */
    password?: string;
    /** User's name (required) */
    name: string;
    /** User's first name */
    firstName?: string;
    /** User's birth date in the system */
    birthDate?: DATE;
    /** User's role in the system */
    role?: Role;
    /** Account creation date */
    createdAt?: Date;
    /** Account last update date */
    updatedAt?: Date;
    /** Account last update date */
    active: Boolean;
}

/**
 * Extended interface for user-related requests
 * Contains various ID formats that might be received in requests
 * These are filtered out in the controller for security purposes
 */
export interface IUserReqBodyRequest extends UserInterface {
    /** Standard ID format */
    id?: string;
    /** Alternative user ID format */
    userId?: string;
    /** UUID format */
    uuid?: string;
    /** MongoDB-style ID format */
    _id?: string;
    /** New password (for password change requests) */
    newPassword?: string;
}

/**
 * Extends the IUser interface with Mongoose Document properties
 */
export interface IUserDocument extends IUser, Document {}

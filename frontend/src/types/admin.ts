import type { IUser, IInformation, IActivity, ICategory } from '@/factories/Factory'

export interface ColumnDef<T> {
    header: string
    accessorKey: keyof T
    cell?: (item: T) => React.ReactNode
}

export interface ModalState<T> {
    isOpen: boolean
    mode: 'create' | 'edit'
    item?: T
}

// Reusable type guards
export const isAuthorObject = (authorId: unknown): authorId is { name: string; id: string; _id: string } => {
    return typeof authorId === 'object' && authorId !== null && 'name' in authorId
}

export const isCategoryObject = (categoryId: unknown): categoryId is { name: string; id: string; _id: string } => {
    return typeof categoryId === 'object' && categoryId !== null && 'name' in categoryId
}

// Types for specific modals
export type UserModalState = ModalState<IUser>
export type InformationModalState = ModalState<IInformation>
export type ActivityModalState = ModalState<IActivity>
export type CategoryModalState = ModalState<ICategory> 
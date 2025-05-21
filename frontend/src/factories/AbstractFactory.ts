import type { IUser, IInformation, IActivity, ICategory } from "@/factories/Factory"

export abstract class AbstractEntityFactory {
    abstract createUser(data: Partial<IUser>): IUser
    abstract createInformation(data: Partial<IInformation>): IInformation
    abstract createActivity(data: Partial<IActivity>): IActivity
    abstract createCategory(data: Partial<ICategory>): ICategory
}
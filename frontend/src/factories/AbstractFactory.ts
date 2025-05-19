import type { User, Information, Activity, Category } from "@/types/factory"

export abstract class AbstractEntityFactory {
    abstract createUser(data: Partial<User>): User
    abstract createInformation(data: Partial<Information>): Information
    abstract createActivity(data: Partial<Activity>): Activity
    abstract createCategory(data: Partial<Category>): Category
}
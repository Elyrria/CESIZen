import type { ICategoryDocument } from "@api/types/category.d.ts"
import categorySchema from "@models/Category/category.schema.ts"
import mongoose from "mongoose"

// Définition du modèle Category
export const Category = mongoose.model<ICategoryDocument>("Category", categorySchema)

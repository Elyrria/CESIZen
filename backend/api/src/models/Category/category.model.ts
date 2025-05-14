import type { ICategoryDocument } from "@api/types/category.d.ts"
import categorySchema from "@models/Category/Category.schema.ts"
import mongoose from "mongoose"


const Category = mongoose.model<ICategoryDocument>("Category", categorySchema)

export default Category

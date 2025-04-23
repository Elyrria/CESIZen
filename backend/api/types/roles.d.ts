import { ROLES } from "@configs/global.configs.ts"

export type Role = (typeof ROLES)[keyof typeof ROLES]

import { z } from "zod"
import TextPosition from "../../../modules/top-bar-notification/types/text-position"

export const PostAdminCreateTopBarNotification = z.object({
    enabled: z.boolean(),
    name: z.string(),
    priority: z.number(),
    content: z.string(),
    textPosition: z.nativeEnum(TextPosition),
    backgroundColor: z.string(),
    textColor: z.string(),
    textSize: z.number(),
    paddingSize: z.number(),
})

export const PostAdminUpdateTopBarNotification = z.object({
    id: z.string(),
    enabled: z.boolean(),
    name: z.string(),
    priority: z.number(),
    content: z.string(),
    textPosition: z.nativeEnum(TextPosition),
    backgroundColor: z.string(),
    textColor: z.string(),
    textSize: z.number(),
    paddingSize: z.number(),
})

export const PostAdminUpdateTopBarNotificationRegions = z.object({
    id: z.string(),
    regions: z.array(z.string()),
})

export const PostAdminUpdateTopBarNotificationCountries = z.object({
    id: z.string(),
    countries: z.array(z.string()),
})

import { model } from "@medusajs/framework/utils"
import TextPosition from "../types/text-position"

const TopBarNotification = model.define("TopBarNotification", {
    id: model.id().primaryKey(),
    enabled: model.boolean(),
    name: model.text(),
    priority: model.number(),
    content: model.text(),
    textPosition: model.enum(TextPosition).default(TextPosition.Left),
    backgroundColor: model.text(),
    textColor: model.text(),
    textSize: model.number(),
    paddingSize: model.number(),
})

export default TopBarNotification

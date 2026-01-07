import { Module } from "@medusajs/framework/utils"
import TopBarNotificationModuleService from "./service"

export const TOP_BAR_NOTIFICATION_MODULE = "top_bar_notification"

export default Module(TOP_BAR_NOTIFICATION_MODULE, {
    service: TopBarNotificationModuleService,
})

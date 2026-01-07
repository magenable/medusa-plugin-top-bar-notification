import TopBarNotificationModule from "../modules/top-bar-notification"
import RegionModule from "@medusajs/medusa/region"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
    {
        linkable: TopBarNotificationModule.linkable.topBarNotification,
        isList: true,
    },
    {
        linkable: RegionModule.linkable.region,
        isList: true,
    }
)

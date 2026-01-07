import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import TopBarNotificationModuleService from "../../../modules/top-bar-notification/service"
import { TOP_BAR_NOTIFICATION_MODULE } from "../../../modules/top-bar-notification"
import { z } from "zod"
import crypto from 'crypto';
import topBarNotificationRegionLinkDefinition from "../../../links/top-bar-notification-region"
import topBarNotificationCountryLinkDefinition from "../../../links/top-bar-notification-region-country"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const SECRET = process.env.JWT_SECRET;

export const RequestSchema = z.object({
    country: z.string(),
    region: z.string(),
})

type RequestInput = z.infer<typeof RequestSchema>

export async function GET(
    req: MedusaRequest<{}, RequestInput>,
    res: MedusaResponse
): Promise<void> {
    const countryISO2 = req.query.country
    const regionId = req.query.region

    if (!countryISO2 || typeof countryISO2 !== "string" || !regionId || typeof regionId !== "string") {
        res.json({});
        return;
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: regionLinksData } = await query.graph({
        entity: topBarNotificationRegionLinkDefinition.entryPoint,
        fields: ["*"],
    })
    const { data: countryLinksData } = await query.graph({
        entity: topBarNotificationCountryLinkDefinition.entryPoint,
        fields: ["*"],
    })

    const regionLinks = {}
    regionLinksData.forEach(link => {
        !regionLinks[link.top_bar_notification_id] && (regionLinks[link.top_bar_notification_id] = [])
        regionLinks[link.top_bar_notification_id].push(link.region_id)
    })
    const countryLinks = {}
    countryLinksData.forEach(link => {
        !countryLinks[link.top_bar_notification_id] && (countryLinks[link.top_bar_notification_id] = [])
        countryLinks[link.top_bar_notification_id].push(link.country_iso_2)
    })

    const region = await req.scope.resolve('region').retrieveRegion(regionId)

    const topBarNotificationModuleService: TopBarNotificationModuleService =
        req.scope.resolve(TOP_BAR_NOTIFICATION_MODULE)
    const notifications = (await topBarNotificationModuleService.listTopBarNotifications())
        .filter((n) => {
            if (regionLinks[n.id] && !regionLinks[n.id].includes(regionId)) {
                return false
            }
            if (countryLinks[n.id] && !countryLinks[n.id].includes(countryISO2)) {
                return false
            }

            return true
        })
        .filter(n => n.enabled !== false)
        .sort((a, b) => a.priority - b.priority)
        .map(n => {
            const hashedId = crypto.createHmac("sha256", SECRET ?? "")
                .update(n.id)
                .digest("hex");

            return Object.fromEntries(
                Object.entries({
                    ...n,
                    id: hashedId,
                }).filter(([key]) => [
                    "id",
                    "backgroundColor",
                    "content",
                    "paddingSize",
                    "priority",
                    "textColor",
                    "textPosition",
                    "textSize",
                ].includes(key))
            );
        });

    res.json({
        "notifications": notifications,
    })
}

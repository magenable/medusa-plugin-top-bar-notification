import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import topBarNotificationRegionLinkDefinition from "../../../../../links/top-bar-notification-region"
import { z } from "zod"
import { updateTopBarNotificationRegionLinksWorkflow }
    from "../../../../../workflows/update-top-bar-notification-region-links"
import { PostAdminUpdateTopBarNotificationRegions } from "../../validators"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const query = req.scope.resolve("query")
    const { id } = req.params

    const { data: regions } = await query.graph({
        entity: topBarNotificationRegionLinkDefinition.entryPoint,
        filters: {
            top_bar_notification_id: id,
        },
        ...req.queryConfig,
    })

    res.json({ regions })
}

type UpdateTopBarNotificationRegionsInput = z.infer<typeof PostAdminUpdateTopBarNotificationRegions>

export async function POST(
    req: MedusaRequest<UpdateTopBarNotificationRegionsInput>,
    res: MedusaResponse
): Promise<void> {
    const { result } = await updateTopBarNotificationRegionLinksWorkflow(req.scope).run({
        input: req.body,
    })

    res.json({ result })
}

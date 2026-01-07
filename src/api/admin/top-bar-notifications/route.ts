import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import {
    createTopBarNotificationWorkflow,
} from "../../../workflows/create-top-bar-notification"
import { TOP_BAR_NOTIFICATION_MODULE } from "../../../modules/top-bar-notification"
import { z } from "zod"
import { PostAdminCreateTopBarNotification } from "./validators"

type PostAdminCreateTopBarNotificationType = z.infer<typeof PostAdminCreateTopBarNotification>

export const POST = async (
    req: MedusaRequest<PostAdminCreateTopBarNotificationType>,
    res: MedusaResponse
) => {
    const { result } = await createTopBarNotificationWorkflow(req.scope)
        .run({
            input: req.validatedBody,
        })

    res.json({ TopBarNotification: result })
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve("query")

    const {
        data: TopBarNotifications, metadata
    } = await query.graph({
        entity: TOP_BAR_NOTIFICATION_MODULE,
        ...req.queryConfig,
    })

    res.json({
        TopBarNotifications,
        count: metadata?.count || 0,
        offset: metadata?.skip || 0,
        limit: metadata?.take || 15,
    })
}

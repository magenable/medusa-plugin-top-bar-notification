import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { TOP_BAR_NOTIFICATION_MODULE } from "../../../../modules/top-bar-notification"
import { z } from "zod"
import { updateTopBarNotificationWorkflow } from "../../../../workflows/update-top-bar-notification"
import { deleteTopBarNotificationWorkflow } from "../../../../workflows/delete-top-bar-notification"
import { PostAdminUpdateTopBarNotification } from "../validators"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const query = req.scope.resolve("query")
    const { id } = req.params

    const { data: topBarNotifications } = await query.graph({
        entity: TOP_BAR_NOTIFICATION_MODULE,
        filters: {
            id,
        },
        ...req.queryConfig,
    }, {
        throwIfKeyNotFound: true,
    })

    res.json({ topBarNotification: topBarNotifications[0] })
}

type UpdateTopBarNotificationInput = z.infer<typeof PostAdminUpdateTopBarNotification>

export async function POST(
    req: MedusaRequest<UpdateTopBarNotificationInput>,
    res: MedusaResponse
): Promise<void> {
    const { result } = await updateTopBarNotificationWorkflow(req.scope).run({
        input: req.body,
    })

    res.json({ topBarNotification: result })
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const { id } = req.params
    await deleteTopBarNotificationWorkflow(req.scope).run({
        input: { id },
    })

    res.json({ id, deleted: true })
}

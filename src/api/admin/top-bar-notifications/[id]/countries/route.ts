import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import topBarNotificationCountryLinkDefinition from "../../../../../links/top-bar-notification-region-country"
import { z } from "zod"
import { updateTopBarNotificationCountryLinksWorkflow }
    from "../../../../../workflows/update-top-bar-notification-country-links"
import { PostAdminUpdateTopBarNotificationCountries } from "../../validators"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const query = req.scope.resolve("query")
    const { id } = req.params

    const { data: countries } = await query.graph({
        entity: topBarNotificationCountryLinkDefinition.entryPoint,
        filters: {
            top_bar_notification_id: id,
        },
        ...req.queryConfig,
    })

    res.json({ countries })
}

type UpdateTopBarNotificationCountriesInput = z.infer<typeof PostAdminUpdateTopBarNotificationCountries>

export async function POST(
    req: MedusaRequest<UpdateTopBarNotificationCountriesInput>,
    res: MedusaResponse
): Promise<void> {
    const { result } = await updateTopBarNotificationCountryLinksWorkflow(req.scope).run({
        input: req.body,
    })

    res.json({ result })
}

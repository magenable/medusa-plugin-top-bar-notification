import {createWorkflow, createStep, WorkflowResponse, StepResponse} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { TOP_BAR_NOTIFICATION_MODULE } from "../modules/top-bar-notification"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import topBarNotificationCountryLinkDefinition from "../links/top-bar-notification-region-country";

type UpdateTopBarNotificationCountryLinksInput = {
    id: string
    countries: string[]
    metadata?: Record<string, unknown>
}

export const updateTopBarNotificationCountryLinksStep = createStep(
    "update-top-bar-notification-country-links-step",
    async (input: UpdateTopBarNotificationCountryLinksInput, { container }) => {
        const linkModule = container.resolve("link")
        const query = container.resolve(ContainerRegistrationKeys.QUERY)
        const { data: linkItems } = await query.graph({
            entity: topBarNotificationCountryLinkDefinition.entryPoint,
            fields: ["*"],
            filters: {
                "top_bar_notification_id": input.id
            },
        })
        linkModule.dismiss(linkItems.filter((item) => {
            return !input.countries.includes(item.country_iso_2);
        }).map((item) => ({
            [TOP_BAR_NOTIFICATION_MODULE]: { top_bar_notification_id: input.id },
            [Modules.REGION]: { country_iso_2: item.country_iso_2 },
        })))

        const countryLinks = input.countries.map((iso_2) => ({
            [TOP_BAR_NOTIFICATION_MODULE]: { top_bar_notification_id: input.id },
            [Modules.REGION]: { country_iso_2: iso_2 },
            data: { metadata: input.metadata },
        }))
        await linkModule.create(countryLinks);

        return new StepResponse(input.id, {})
    },
)

export const updateTopBarNotificationCountryLinksWorkflow = createWorkflow(
    "update-top-bar-notification-country-links",
    (input: UpdateTopBarNotificationCountryLinksInput) => {
        const topBarNotificationId = updateTopBarNotificationCountryLinksStep(input)

        emitEventStep({
            eventName: "top-bar-notification.countries.updated",
            data: {
                id: topBarNotificationId,
            },
        })

        return new WorkflowResponse(topBarNotificationId)
    }
)


import {createWorkflow, createStep, WorkflowResponse, StepResponse} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { TOP_BAR_NOTIFICATION_MODULE } from "../modules/top-bar-notification"
import topBarNotificationRegionLinkDefinition from "../links/top-bar-notification-region"

type UpdateTopBarNotificationRegionLinksInput = {
    id: string
    regions: string[]
    metadata?: Record<string, unknown>
}

export const updateTopBarNotificationRegionLinksStep = createStep(
    "update-top-bar-notification-region-links-step",
    async (input: UpdateTopBarNotificationRegionLinksInput, { container }) => {
        const linkModule = container.resolve("link")
        const query = container.resolve(ContainerRegistrationKeys.QUERY)
        const { data: linkItems } = await query.graph({
            entity: topBarNotificationRegionLinkDefinition.entryPoint,
            fields: ["*"],
            filters: {
                "top_bar_notification_id": input.id
            },
        })
        linkModule.dismiss(linkItems.filter((item) => {
            return !input.regions.includes(item.region_id);
        }).map((item) => ({
            [TOP_BAR_NOTIFICATION_MODULE]: { top_bar_notification_id: input.id },
            [Modules.REGION]: { region_id: item.region_id },
        })))

        const regionLinks = input.regions.map((regionId) => ({
            [TOP_BAR_NOTIFICATION_MODULE]: { top_bar_notification_id: input.id },
            [Modules.REGION]: { region_id: regionId },
            data: { metadata: input.metadata },
        }))
        await linkModule.create(regionLinks);

        return new StepResponse(input.id, {})
    },
)

export const updateTopBarNotificationRegionLinksWorkflow = createWorkflow(
    "update-top-bar-notification-region-links",
    (input: UpdateTopBarNotificationRegionLinksInput) => {
        const topBarNotificationId = updateTopBarNotificationRegionLinksStep(input)

        emitEventStep({
            eventName: "top-bar-notification.regions.updated",
            data: {
                id: topBarNotificationId,
            },
        })

        return new WorkflowResponse(topBarNotificationId)
    }
)

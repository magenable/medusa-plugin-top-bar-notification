import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "@medusajs/medusa/core-flows"
import TopBarNotificationModuleService from "../modules/top-bar-notification/service"
import { TOP_BAR_NOTIFICATION_MODULE } from "../modules/top-bar-notification"
import TopBarNotification from "../modules/top-bar-notification/types/top-bar-notification"

export type UpdateTopBarNotificationInput = TopBarNotification

export const updateTopBarNotificationStep = createStep(
    "update-top-bar-notification-step",
    async (input: UpdateTopBarNotificationInput, { container }) => {
        const service: TopBarNotificationModuleService = container.resolve(
            TOP_BAR_NOTIFICATION_MODULE
        )

        const originalTopBarNotification = await service.retrieveTopBarNotification(input.id)
        const topBarNotification = await service.updateTopBarNotifications(input)

        return new StepResponse(topBarNotification, originalTopBarNotification)
    },
    async (originalInput, { container }) => {
        if (!originalInput) {
            return
        }

        const service: TopBarNotificationModuleService = container.resolve(TOP_BAR_NOTIFICATION_MODULE)
        await service.updateTopBarNotifications(originalInput)
    }
)

export const updateTopBarNotificationWorkflow = createWorkflow(
    "update-top-bar-notification",
    (input: UpdateTopBarNotificationInput) => {
        const topBarNotification = updateTopBarNotificationStep(input)

        emitEventStep({
            eventName: "top-bar-notification.updated",
            data: {
                id: topBarNotification.id,
            },
        })

        return new WorkflowResponse(topBarNotification)
    }
)

import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
    emitEventStep,
} from "@medusajs/medusa/core-flows"
import { TOP_BAR_NOTIFICATION_MODULE } from "../modules/top-bar-notification"
import TopBarNotificationModuleService from "../modules/top-bar-notification/service"

export type DeleteTopBarNotificationInput = {
    id: string
}

export const deleteTopBarNotificationStep = createStep(
    "delete-top-bar-notification-step",
    async (input: DeleteTopBarNotificationInput, { container }) => {
        const topBarNotificationModuleService: TopBarNotificationModuleService = container.resolve(
            TOP_BAR_NOTIFICATION_MODULE
        )

        const topBarNotification = await topBarNotificationModuleService.retrieveTopBarNotification(input.id)

        await topBarNotificationModuleService.deleteTopBarNotifications(input.id)

        return new StepResponse(
            { id: input.id, deleted: true },
            topBarNotification
        )
    },
    async (topBarNotification, { container }) => {
        if (!topBarNotification) {
            return null
        }
        const topBarNotificationModuleService: TopBarNotificationModuleService = container.resolve(
            TOP_BAR_NOTIFICATION_MODULE
        )

        await topBarNotificationModuleService.createTopBarNotifications(topBarNotification)
    }
)

type DeleteTopBarNotificationWorkflowInput = DeleteTopBarNotificationInput

export const deleteTopBarNotificationWorkflow = createWorkflow(
    "delete-top-bar-notification",
    (input: DeleteTopBarNotificationWorkflowInput) => {
        const topBarNotification = deleteTopBarNotificationStep(input)

        emitEventStep({
            eventName: "top-bar-notification.deleted",
            data: {
                id: topBarNotification.id,
            },
        })

        return new WorkflowResponse(topBarNotification)
    }
)

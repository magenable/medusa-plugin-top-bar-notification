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
import TopBarNotification from "../modules/top-bar-notification/types/top-bar-notification"

export type CreateTopBarNotificationInput = Omit<TopBarNotification, 'id'>

export const createTopBarNotificationStep = createStep(
    "create-top-bar-notification-step",
    async (input: CreateTopBarNotificationInput, { container }) => {
        const topBarNotificationModuleService: TopBarNotificationModuleService = container.resolve(
            TOP_BAR_NOTIFICATION_MODULE
        )

        const topBarNotification = await topBarNotificationModuleService.createTopBarNotifications(input)

        return new StepResponse(topBarNotification, topBarNotification.id)
    },
    async (id: string, { container }) => {
        const topBarNotificationModuleService: TopBarNotificationModuleService = container.resolve(
            TOP_BAR_NOTIFICATION_MODULE
        )

        await topBarNotificationModuleService.deleteTopBarNotifications(id)
    }
)

type CreateTopBarNotificationWorkflowInput = CreateTopBarNotificationInput

export const createTopBarNotificationWorkflow = createWorkflow(
    "create-top-bar-notification",
    (input: CreateTopBarNotificationWorkflowInput) => {
        const topBarNotification = createTopBarNotificationStep(input)

        emitEventStep({
            eventName: "top-bar-notification.created",
            data: {
                id: topBarNotification.id,
            },
        })

        return new WorkflowResponse(topBarNotification)
    }
)

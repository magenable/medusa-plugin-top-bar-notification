import {Drawer, Heading, Button, toast } from "@medusajs/ui"
import { useForm, FormProvider } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { useState } from "react"
import TopBarNotification from "../../modules/top-bar-notification/types/top-bar-notification"
import { TopBarNotificationFormFields } from "./top-bar-notification-form-fields.tsx"
import { useTranslation } from "react-i18next"

type EditTopBarNotificationFormData = TopBarNotification
type EditTopBarNotificationDrawerProps = {
    topBarNotification: TopBarNotification
}

export const EditTopBarNotificationDrawer = ({ topBarNotification }: EditTopBarNotificationDrawerProps) => {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [enabled, setEnabled] = useState(topBarNotification.enabled)
    const [textPosition, setTextPosition] = useState(topBarNotification.textPosition)
    const { t } = useTranslation("MagenableTopBarNotification")

    const form = useForm<EditTopBarNotificationFormData>({
        defaultValues: {
            name: topBarNotification.name,
            enabled: topBarNotification.enabled,
            priority: topBarNotification.priority,
            content: topBarNotification.content,
            textPosition: topBarNotification.textPosition,
            backgroundColor: topBarNotification.backgroundColor,
            textColor: topBarNotification.textColor,
            textSize: topBarNotification.textSize,
            paddingSize: topBarNotification.paddingSize,
        },
    })

    const updateTopBarNotificationMutation = useMutation({
        mutationFn: async (data: EditTopBarNotificationFormData) => {
            return await sdk.client.fetch(`/admin/top-bar-notifications/${topBarNotification.id}`, {
                method: "POST",
                body: data,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["top-bar-notification", topBarNotification.id] })
            queryClient.invalidateQueries({ queryKey: ["top-bar-notifications"] })
            setOpen(false)
            toast.success(t("drawer.edit_item.update.success.title"), {
                description: t("drawer.edit_item.update.success.description"),
                position: "top-right",
            })
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
                position: "top-right",
            })
        },
    })

    const handleSubmit = form.handleSubmit((data) => {
        data.id = topBarNotification.id
        data.enabled = enabled
        data.priority = Number(data.priority)
        data.textSize = Number(data.textSize)
        data.paddingSize = Number(data.paddingSize)
        data.textPosition = textPosition

        updateTopBarNotificationMutation.mutate({
            ...data
        })
    })

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <Button variant="secondary" size="small">
                    {t("drawer.edit_item.button")}
                </Button>
            </Drawer.Trigger>
            <Drawer.Content>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                        <Drawer.Header>
                            <Heading level="h1">{t("drawer.edit_item.heading")}</Heading>
                        </Drawer.Header>
                        <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
                            <TopBarNotificationFormFields enabled={enabled} setEnabled={setEnabled} textPosition={textPosition}
                                                          setTextPosition={setTextPosition} />
                        </Drawer.Body>
                        <Drawer.Footer>
                            <div className="flex items-center justify-end gap-x-2">
                                <Drawer.Close asChild>
                                    <Button size="small" variant="secondary">
                                        {t("drawer.edit_item.cancel")}
                                    </Button>
                                </Drawer.Close>
                                <Button type="submit" size="small"
                                        isLoading={updateTopBarNotificationMutation.isPending}>
                                    {t("drawer.edit_item.save")}</Button>
                            </div>
                        </Drawer.Footer>
                    </form>
                </FormProvider>
            </Drawer.Content>
        </Drawer>
    )
}

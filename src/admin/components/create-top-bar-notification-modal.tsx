import { FocusModal, Heading, Button, toast } from "@medusajs/ui"
import { useForm, FormProvider } from "react-hook-form"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import TopBarNotification from "../../modules/top-bar-notification/types/top-bar-notification"
import TextPosition from "../../modules/top-bar-notification/types/text-position"
import { TopBarNotificationFormFields } from "./top-bar-notification-form-fields.tsx"
import { useTranslation } from "react-i18next"

type CreateTopBarNotificationFormData = Omit<TopBarNotification, 'id'>
type CreateTopBarNotificationModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void,
    refetchList: () => void,
}

export const CreateTopBarNotificationModal = ({ open, onOpenChange, refetchList }: CreateTopBarNotificationModalProps) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [enabled, setEnabled] = useState(true)
    const [textPosition, setTextPosition] = useState(TextPosition.Center)
    const { t } = useTranslation("MagenableTopBarNotification")

    const form = useForm<CreateTopBarNotificationFormData>({
        defaultValues: {
            name: "",
            enabled: true,
            priority: 10,
            content: "",
            textPosition: TextPosition.Center,
            backgroundColor: "transparent",
            textColor: "black",
            textSize: 14,
            paddingSize: 10,
        },
    })

    const createTopBarNotificationMutation = useMutation({
        mutationFn: async (data: CreateTopBarNotificationFormData) => {
            return await sdk.client.fetch<{ TopBarNotification: TopBarNotification }>("/admin/top-bar-notifications", {
                method: "POST",
                body: data,
            })
        },
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["top-bar-notifications"] })
            form.reset()
            onOpenChange(false)
            navigate(`/top-bar-notifications/${data.TopBarNotification.id}`)
            toast.success(t("modal.create.success.title"), {
                description: t("modal.create.success.description"),
                position: "top-right",
            })
            await refetchList()
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
                position: "top-right",
            })
        },
    })

    const handleSubmit = form.handleSubmit((data) => {
        data.enabled = enabled
        data.priority = Number(data.priority)
        data.textSize = Number(data.textSize)
        data.paddingSize = Number(data.paddingSize)
        data.textPosition = textPosition

        createTopBarNotificationMutation.mutate({
            ...data,
        })
    })

    return (
        <FocusModal open={open} onOpenChange={onOpenChange}>
            <FocusModal.Content>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-hidden">
                        <FocusModal.Header>
                            <div className="flex items-center justify-between">
                                <Heading level="h1">{t("modal.heading")}</Heading>
                            </div>
                        </FocusModal.Header>
                        <FocusModal.Body className="flex flex-1 flex-col overflow-y-auto">
                            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                                <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                                    <TopBarNotificationFormFields enabled={enabled} setEnabled={setEnabled} textPosition={textPosition}
                                                                  setTextPosition={setTextPosition} />
                                </div>
                            </div>
                        </FocusModal.Body>
                        <FocusModal.Footer>
                            <div className="flex items-center gap-x-2">
                                <FocusModal.Close asChild>
                                    <Button variant="secondary" size="small">{t("modal.cancel")}</Button>
                                </FocusModal.Close>
                                <Button type="submit" size="small"
                                        isLoading={createTopBarNotificationMutation.isPending}>
                                    {t("modal.create")}</Button>
                            </div>
                        </FocusModal.Footer>
                    </form>
                </FormProvider>
            </FocusModal.Content>
        </FocusModal>
    )
}

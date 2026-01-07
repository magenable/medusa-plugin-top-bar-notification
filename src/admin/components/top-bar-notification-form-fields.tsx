import { Label, Input, Switch, Textarea, Select, InlineTip} from "@medusajs/ui"
import { Controller } from "react-hook-form"
import TextPosition from "../../modules/top-bar-notification/types/text-position"
import { useTranslation } from "react-i18next"

type FormFieldsProps = {
    enabled: boolean
    setEnabled: (open: boolean) => void,
    textPosition: string,
    setTextPosition: (open: TextPosition) => void,
}

export const TopBarNotificationFormFields = (
    {enabled, setEnabled, textPosition, setTextPosition }: FormFieldsProps
) => {
    const { t } = useTranslation("MagenableTopBarNotification")

    return (
        <>
            <Controller
                name="enabled"
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.enabled")}</Label>
                        <Switch name={field.name} checked={enabled}
                                onCheckedChange={setEnabled} />
                    </div>
                )}
            />
            <Controller
                name="name"
                rules={{ required: t("edit_item_fields.name.required") }}
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.name.label")}</Label>
                        <Input {...field} placeholder={t("edit_item_fields.name.placeholder")} />
                    </div>
                )}
            />
            <Controller
                name="priority"
                rules={{ required: t("edit_item_fields.priority.required") }}
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.priority.label")}</Label>
                        <Input {...field} placeholder={t("edit_item_fields.priority.placeholder")}
                               type="number" />
                    </div>
                )}
            />
            <Controller
                name="textPosition"
                rules={{ required: t("edit_item_fields.text_position.required") }}
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.text_position.label")}</Label>
                        <Select name={field.name}
                                value={textPosition}
                                onValueChange={
                                    (value: TextPosition) => setTextPosition(value)
                                }>
                            <Select.Trigger>
                                <Select.Value placeholder={t("edit_item_fields.text_position.placeholder")} />
                            </Select.Trigger>
                            <Select.Content>
                                {Object.entries(TextPosition).map(([value, key]) => (
                                    <Select.Item key={key} value={key}>
                                        {value}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select>
                    </div>
                )}
            />
            <Controller
                name="backgroundColor"
                rules={{ required: t("edit_item_fields.background_color.required") }}
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.background_color.label")}</Label>
                        <Input {...field} placeholder={t("edit_item_fields.background_color.placeholder")} />
                        <input
                            type="color"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-9 w-full rounded border border-ui-border-base cursor-pointer"
                        />
                        <InlineTip label={t("edit_item_fields.background_color.tip_label")}>
                            <i>transparent</i>, <i>#ffffff</i>
                        </InlineTip>
                    </div>
                )}
            />
            <Controller
                name="textColor"
                rules={{ required: t("edit_item_fields.text_color.required") }}
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.text_color.label")}</Label>
                        <Input {...field} placeholder={t("edit_item_fields.text_color.placeholder")} />
                        <input
                            type="color"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-9 w-full rounded border border-ui-border-base cursor-pointer"
                        />
                        <InlineTip label={t("edit_item_fields.text_color.tip_label")}>
                            <i>black</i>, <i>#000000</i>
                        </InlineTip>
                    </div>
                )}
            />
            <Controller
                name="textSize"
                rules={{ required: t("edit_item_fields.text_size.required") }}
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.text_size.label")}</Label>
                        <Input {...field} placeholder={t("edit_item_fields.text_size.placeholder")}
                               type="number" />
                    </div>
                )}
            />
            <Controller
                name="paddingSize"
                rules={{ required: t("edit_item_fields.padding_size.required") }}
                render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.padding_size.label")}</Label>
                        <Input {...field} placeholder={t("edit_item_fields.padding_size.placeholder")}
                               type="number" />
                    </div>
                )}
            />
            <Controller
                name="content"
                rules={{ required: t("edit_item_fields.content.required") }}
                render={({ field }) => (
                    <div className="col-span-2 flex flex-col gap-y-2">
                        <Label size="small" weight="plus">{t("edit_item_fields.content.label")}</Label>
                        <Textarea {...field} placeholder={t("edit_item_fields.content.placeholder")} rows={10} />
                    </div>
                )}
            />
        </>
    )
}

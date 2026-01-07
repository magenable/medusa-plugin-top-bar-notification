import { Container, Heading, Text, Label, Switch, Table } from "@medusajs/ui"
import { LoaderFunctionArgs, UIMatch } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import TopBarNotification from "../../../../modules/top-bar-notification/types/top-bar-notification"
import { EditTopBarNotificationDrawer } from "../../../components/edit-top-bar-notification-drawer"
import { EditTopBarNotificationRegionsAndCountriesDrawer } from
        "../../../components/edit-top-bar-notification-regions-and-countries-drawer"
import { useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { useTranslation } from "react-i18next"

type TopBarNotificationResponse = {
    topBarNotification: TopBarNotification
}
type RegionsResponse = {
    regions: { top_bar_notification_id: string, region_id: string }[]
}
type CountriesResponse = {
    countries: { top_bar_notification_id: string, country_iso_2: string }[]
}

const TopBarNotificationDetailsPage = () => {
    const { id } = useParams()
    const [regions, setRegions] = useState<HttpTypes.AdminRegion[]>([])
    const { t } = useTranslation("MagenableTopBarNotification")

    useEffect(() => {
        sdk.admin.region.list()
            .then(({ regions: dataRegions }) => {
                setRegions(dataRegions)
            })
    }, [])

    const { data: topBarNotificationData } = useQuery({
        queryFn: () =>
            sdk.client.fetch<TopBarNotificationResponse>(`/admin/top-bar-notifications/${id}`, {
                method: "GET",
            }),
        queryKey: ["top-bar-notifications", id]
    })

    const topBarNotification = topBarNotificationData?.topBarNotification

    const { data: topBarNotificationRegionsData } = useQuery({
        queryFn: () =>
            sdk.client.fetch<RegionsResponse>(`/admin/top-bar-notifications/${id}/regions`, {
                method: "GET",
            }),
        queryKey: ["top-bar-notification-regions", id]
    })
    const topBarNotificationRegions = topBarNotificationRegionsData?.regions?.map((region) => {
        return region.region_id
    });
    const { data: topBarNotificationCountriesData } = useQuery({
        queryFn: () =>
            sdk.client.fetch<CountriesResponse>(`/admin/top-bar-notifications/${id}/countries`, {
                method: "GET",
            }),
        queryKey: ["top-bar-notification-countries", id]
    })
    const topBarNotificationCountries = topBarNotificationCountriesData?.countries?.map((country) => {
        return country.country_iso_2
    });

    return (
        <>
            <Container className="divide-y p-0">
                <div className="flex items-center justify-between px-6 py-4">
                    <Heading level="h1">{t("item.heading")}</Heading>
                    <div className="flex items-center gap-x-2">
                        {topBarNotification && (
                            <EditTopBarNotificationDrawer topBarNotification={topBarNotification} />
                        )}
                    </div>
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Label htmlFor="manage-inventory">{t("item.enabled")}</Label>
                    <Switch id="manage-inventory" checked={topBarNotification?.enabled} disabled={true} />
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.name")}</Text>
                    <Text size="small" weight="plus" leading="compact">{topBarNotification?.name}</Text>
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.priority")}</Text>
                    <Text size="small" weight="plus" leading="compact">{topBarNotification?.priority}</Text>
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.text_position")}</Text>
                    <Text size="small" weight="plus" leading="compact">{topBarNotification?.textPosition}</Text>
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.background_color")}</Text>
                    {topBarNotification?.backgroundColor.match(/#.*/i) ? <>
                            <input
                                type="color"
                                value={topBarNotification?.backgroundColor}
                                disabled={true}
                                className="h-9 w-full rounded border border-ui-border-base"
                            />
                        </>
                        : <Text size="small" weight="plus" leading="compact">{topBarNotification?.backgroundColor}</Text>}
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.text_color")}</Text>
                    {topBarNotification?.textColor.match(/#.*/i) ? <>
                            <input
                                type="color"
                                value={topBarNotification?.textColor}
                                disabled={true}
                                className="h-9 w-full rounded border border-ui-border-base"
                            />
                        </>
                        : <Text size="small" weight="plus" leading="compact">{topBarNotification?.textColor}</Text>}
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.text_size")}</Text>
                    <Text size="small" weight="plus" leading="compact">{topBarNotification?.textSize} px</Text>
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.padding_size")}</Text>
                    <Text size="small" weight="plus" leading="compact">{topBarNotification?.paddingSize} px</Text>
                </div>
                <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
                    <Text size="small" weight="plus" leading="compact">{t("item.content")}</Text>
                    <Text size="small" weight="plus" leading="compact">{topBarNotification?.content}</Text>
                </div>
            </Container>
            <Container className="divide-y p-0">
                <div className="flex items-center justify-between px-6 py-4">
                    <Heading level="h1">{t("item.regions_and_countries")}</Heading>
                    <div className="flex items-center gap-x-2">
                        { topBarNotification && topBarNotificationRegions && topBarNotificationCountries &&
                            <EditTopBarNotificationRegionsAndCountriesDrawer topBarNotification={topBarNotification}
                                topBarNotificationRegions={topBarNotificationRegions}
                                topBarNotificationCountries={topBarNotificationCountries}
                                regions={regions} />
                        }
                    </div>
                </div>
                { !topBarNotificationRegions?.length ?
                    <div className="text-ui-fg-subtle text-center px-6 py-4">{t("item.no_restrictions")}</div>
                        :
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{t("item.regions")}</Table.HeaderCell>
                                <Table.HeaderCell>{t("item.region_countries")}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {regions?.map((region) => {
                                if (!topBarNotificationRegions?.includes(region.id)) {
                                    return;
                                }
                                return <Table.Row key={region.id}>
                                    <Table.Cell className="py-3">
                                        {region.name}
                                    </Table.Cell>
                                    <Table.Cell className="py-3">
                                        {region.countries?.map((country) => {
                                            if (!country.iso_2) {
                                                return;
                                            }
                                            if (!topBarNotificationCountries?.includes(country.iso_2)) {
                                                return;
                                            }
                                            return <div key={country.iso_2}>{country.display_name}</div>;
                                        })}
                                    </Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                }
            </Container>
        </>
    )
}

export const config = defineRouteConfig({
    label: "Top Bar Notification Details",
})

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params

    const { topBarNotification } =
        await sdk.client.fetch<TopBarNotificationResponse>(
            `/admin/top-bar-notifications/${id}`
        )

    return { topBarNotification }
}

export const handle = {
    breadcrumb: ({ data }: UIMatch<TopBarNotificationResponse>) => {
        return data?.topBarNotification?.name ?? "Top Bar Notification"
    }
}

export default TopBarNotificationDetailsPage


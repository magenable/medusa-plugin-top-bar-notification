import { Drawer, Heading, Table, Checkbox, Label, Button, Alert, toast } from "@medusajs/ui"
import { Controller, useForm, FormProvider } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import {useEffect, useState} from "react"
import TopBarNotification from "../../modules/top-bar-notification/types/top-bar-notification"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

type EditTopBarNotificationRegionsAndCountriesFormData = {
    id: string,
    regions: string[],
    countries: string[],
}

type EditTopBarNotificationRegionsDrawerProps = {
    topBarNotification: TopBarNotification,
    regions: HttpTypes.AdminRegion[],
    topBarNotificationRegions: string[],
    topBarNotificationCountries: string[],
}

export const EditTopBarNotificationRegionsAndCountriesDrawer = (
    {
        topBarNotification,
        regions,
        topBarNotificationRegions,
        topBarNotificationCountries
    }: EditTopBarNotificationRegionsDrawerProps
) => {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const { t } = useTranslation("MagenableTopBarNotification")

    const form = useForm<EditTopBarNotificationRegionsAndCountriesFormData>({
        defaultValues: {
            id: topBarNotification.id,
            regions: [],
            countries: [],
        },
    })

    const { setValue, watch } = form
    const selectedRegions = watch("regions")
    useEffect(() => {
        setValue("regions", topBarNotificationRegions)
    }, [setValue, topBarNotificationRegions])
    console.log('topBarNotificationRegions', topBarNotificationRegions)
    console.log('selectedRegions', selectedRegions)

    const toggleRegion = (region: HttpTypes.AdminRegion, checked: boolean) => {
        if (checked && !selectedRegions.includes(region.id)) {
            setValue("regions", [...selectedRegions, region.id])
        } else {
            setValue(
                "regions",
                selectedRegions.filter((regionId) => regionId !== region.id)
            )
            let countries = selectedCountries;
            region.countries?.forEach((country) => {
                countries = countries.filter((iso_2) => iso_2 !== country.iso_2)
            })
            setValue(
                "countries",
                countries
            )
        }
    }

    const selectedCountries = watch("countries", topBarNotificationCountries)
    useEffect(() => {
        setValue("countries", topBarNotificationCountries)
    }, [setValue, topBarNotificationCountries])
    console.log('topBarNotificationCountries', topBarNotificationCountries)
    console.log('selectedCountries', selectedCountries)

    const toggleRegionCountry = (
        iso_2: string,
        checked: boolean,
        region?: HttpTypes.AdminRegion | null,
    ) => {
        if (checked && !selectedCountries.includes(iso_2)) {
            if (region && !selectedRegions.includes(region.id)) {
                toggleRegion(region, true)
            }
            setValue("countries", [...selectedCountries, iso_2])
        } else {
            setValue(
                "countries",
                selectedCountries.filter((item_iso_2) => item_iso_2 !== iso_2)
            )
        }
    }

    const updateTopBarNotificationRegionsAndCountriesMutation = useMutation({
        mutationFn: async (data: EditTopBarNotificationRegionsAndCountriesFormData) => {
            await sdk.client.fetch(`/admin/top-bar-notifications/${topBarNotification.id}/regions`, {
                method: "POST",
                body: {
                    id: data.id,
                    regions: data.regions,
                },
            })
            await sdk.client.fetch(`/admin/top-bar-notifications/${topBarNotification.id}/countries`, {
                method: "POST",
                body: {
                    id: data.id,
                    countries: data.countries,
                },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["top-bar-notification-regions", topBarNotification.id] })
            queryClient.invalidateQueries({ queryKey: ["top-bar-notification-countries", topBarNotification.id] })
            setOpen(false)
            toast.success(t("drawer.edit_regions.update.success.title"), {
                description: t("drawer.edit_regions.update.success.description"),
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
        updateTopBarNotificationRegionsAndCountriesMutation.mutate({
            ...data
        })
    })

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <Button variant="secondary" size="small">
                    {t("drawer.edit_regions.button")}
                </Button>
            </Drawer.Trigger>
            <Drawer.Content>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                        <Drawer.Header>
                            <Heading level="h1">{t("drawer.edit_regions.heading")}</Heading>
                        </Drawer.Header>
                        <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-2 overflow-y-auto">
                            <Alert>{t("drawer.edit_regions.alert")}</Alert>
                            <Alert>{t("drawer.edit_regions.alert_2")}</Alert>
                            <Table className="mt-3 border-collapse w-full">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            {t("drawer.edit_regions.cell.header.regions")}</Table.HeaderCell>
                                        <Table.HeaderCell>
                                            {t("drawer.edit_regions.cell.header.countries")}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {regions.map((region) => (
                                    <Table.Row key={region.id}>
                                        <Table.Cell className="py-3">
                                            <Controller
                                                name="regions"
                                                render={() => (
                                                    <Label>
                                                        <Checkbox checked={selectedRegions.includes(region.id)}
                                                                  onCheckedChange={(value) =>
                                                                      toggleRegion(region, !!value)
                                                                  } />
                                                        <span className="ml-1">{region.name}</span>
                                                    </Label>
                                                )}
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="py-3">
                                            {region.countries?.map((country) => {
                                                if (!country.iso_2) { return; }
                                                const iso_2: string = country.iso_2;
                                                return <Controller
                                                    key={iso_2}
                                                    name="countries"
                                                    render={({}) => (
                                                        <div>
                                                            <Label>
                                                                <Checkbox checked={selectedCountries.includes(iso_2)}
                                                                          onCheckedChange={(value) =>
                                                                              toggleRegionCountry(iso_2, !!value, region)
                                                                          } />
                                                                <span className="ml-1">{country.name}</span>
                                                            </Label>
                                                        </div>
                                                    )}
                                                />
                                            })}
                                        </Table.Cell>
                                    </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <div className="flex items-center justify-end gap-x-2">
                                <Drawer.Close asChild>
                                    <Button size="small" variant="secondary">
                                        {t("drawer.edit_regions.cancel")}
                                    </Button>
                                </Drawer.Close>
                                <Button type="submit" size="small"
                                        isLoading={updateTopBarNotificationRegionsAndCountriesMutation.isPending}>
                                    {t("drawer.edit_regions.save")}
                                </Button>
                            </div>
                        </Drawer.Footer>
                    </form>
                </FormProvider>
            </Drawer.Content>
        </Drawer>
    )
}

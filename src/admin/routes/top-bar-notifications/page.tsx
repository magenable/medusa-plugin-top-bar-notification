import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PaperClip, ArrowUpRightOnBox, Trash } from "@medusajs/icons"
import {
    Container,
    Heading,
    createDataTableColumnHelper,
    DataTable,
    DataTablePaginationState,
    useDataTable,
    Button,
    toast,
    usePrompt,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CreateTopBarNotificationModal } from "../../components/create-top-bar-notification-modal"

type TopBarNotification = {
    id: string
    name: string,
    enabled: boolean,
    priority: number,
}
type TopBarNotificationsResponse = {
    TopBarNotifications: TopBarNotification[]
    count: number
    limit: number
    offset: number
}

const columnHelper = createDataTableColumnHelper<TopBarNotification>()

const TopBarNotificationsPage = () => {
    const [ isCreateModalOpen, setIsCreateModalOpen ] = useState(false)
    const navigate = useNavigate()
    const prompt = usePrompt()
    const { t } = useTranslation("MagenableTopBarNotification")

    const columns = [
        columnHelper.accessor("name", {
            header: 'asdfasdf' //t("list.name"),
        }),
        columnHelper.accessor("priority", {
            header: t("list.priority"),
        }),
        columnHelper.action({
            actions: [
                [
                    {
                        icon: <ArrowUpRightOnBox />,
                        label: t("list.open"),
                        onClick: (ctx) => {
                            navigate(`${ctx.row.original.id}`)
                        },
                    },
                ],
                [
                    {
                        icon: <Trash />,
                        label: t("actions.delete"),
                        onClick: async (ctx) => {
                            const confirmed = await prompt({
                                title: t("list.confirmation.delete.title"),
                                description:
                                    t("list.confirmation.delete.content",
                                        { notificationName: ctx.row.original.name }),
                                confirmText: t("list.confirmation.delete.confirm"),
                                cancelText: t("list.confirmation.delete.cancel"),
                                variant: "confirmation",
                            })

                            if (!confirmed) {
                                return
                            }

                            await sdk.client.fetch(`admin/top-bar-notifications/${ctx.row.id}`, {
                                method: "DELETE"
                            })

                            toast.success(t("list.delete.success.title"), {
                                description: t("list.delete.success.description"),
                                position: "top-right",
                            })

                            await refetch()
                        },
                    },
                ],
            ],
        })
    ]
    const limit = 15
    const [pagination, setPagination] = useState<DataTablePaginationState>({
        pageSize: limit,
        pageIndex: 0,
    })
    const offset = useMemo(() => {
        return pagination.pageIndex * limit
    }, [pagination])

    const { data, isLoading, refetch } = useQuery<TopBarNotificationsResponse>({
        queryFn: () => sdk.client.fetch(`/admin/top-bar-notifications`, {
            query: {
                limit,
                offset,
                order: "priority",
            },
        }),
        queryKey: ["top-bar-notifications", limit, offset],
    })

    const table = useDataTable({
        columns,
        data: data?.TopBarNotifications || [],
        getRowId: (row) => row.id,
        rowCount: data?.count || 0,
        isLoading,
        pagination: {
            state: pagination,
            onPaginationChange: setPagination,
        },
        onRowClick: (_event, row) => {
            navigate(`${row.id}`)
        },
    })

    return (
        <Container className="divide-y p-0">
            <DataTable instance={table}>
                <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                    <Heading>{t("list.heading")}</Heading>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        {t("list.create_new")}
                    </Button>
                </DataTable.Toolbar>
                <DataTable.Table />
                <DataTable.Pagination />
            </DataTable>
            <CreateTopBarNotificationModal open={isCreateModalOpen} refetchList={refetch}
                                           onOpenChange={setIsCreateModalOpen} />
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Top Bar Notifications",
    icon: PaperClip,
})

export const handle = {
    breadcrumb: () => "Top Bar Notifications",
}

export default TopBarNotificationsPage

import {
    defineMiddlewares,
    validateAndTransformBody,
    validateAndTransformQuery,
} from "@medusajs/framework/http"
import {
    PostAdminCreateTopBarNotification,
    PostAdminUpdateTopBarNotification,
    PostAdminUpdateTopBarNotificationRegions,
    PostAdminUpdateTopBarNotificationCountries,
} from "./admin/top-bar-notifications/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetTopBarNotificationsSchema = createFindParams()

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/top-bar-notifications",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminCreateTopBarNotification),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(
                    GetTopBarNotificationsSchema,
                    {
                        defaults: [
                            "id",
                            "name",
                            "priority",
                        ],
                        isList: true,
                    }
                ),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications/:id",
            methods: ["GET"],
            middlewares: [
                validateAndTransformQuery(
                    GetTopBarNotificationsSchema,
                    {
                        isList: false,
                        defaults: [
                            "id",
                            "enabled",
                            "name",
                            "priority",
                            "content",
                            "textPosition",
                            "backgroundColor",
                            "textColor",
                            "textSize",
                            "paddingSize",
                        ],
                    }
                ),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications/:id",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminUpdateTopBarNotification),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications/:id/regions",
            methods: ["GET"],
            middlewares: [
                validateAndTransformQuery(
                    createFindParams(),
                    {
                        isList: false,
                        defaults: [
                            "top_bar_notification_id",
                            "region_id",
                        ],
                    }
                ),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications/:id/regions",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminUpdateTopBarNotificationRegions),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications/:id/countries",
            methods: ["GET"],
            middlewares: [
                validateAndTransformQuery(
                    createFindParams(),
                    {
                        isList: false,
                        defaults: [
                            "top_bar_notification_id",
                            "country_iso_2",
                        ],
                    }
                ),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications/:id/countries",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminUpdateTopBarNotificationCountries),
            ],
        },
        {
            matcher: "/admin/top-bar-notifications/:id",
            method: "DELETE",
        },
        {
            matcher: "/store/top-bar-notifications",
            method: "GET",
        },
    ],
})

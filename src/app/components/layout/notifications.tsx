"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Badge } from "@/app/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle, Clock, X } from "lucide-react"
import { useTranslations } from 'next-intl'

export function Notifications() {
  const t = useTranslations()

  const notifications = [
    {
      id: 1,
      type: "warning",
      titleKey: "common.policyExpiring",
      descriptionKey: "common.policyExpiringDesc",
      time: "2 min atrás",
      read: false,
    },
    {
      id: 2,
      type: "success",
      titleKey: "common.claimApproved",
      descriptionKey: "common.claimApprovedDesc",
      time: "1 hora atrás",
      read: false,
    },
    {
      id: 3,
      type: "info",
      titleKey: "common.newActivityRegistered",
      descriptionKey: "common.newActivityDesc",
      time: "3 horas atrás",
      read: true,
    },
    {
      id: 4,
      type: "warning",
      titleKey: "common.pendingDocuments",
      descriptionKey: "common.pendingDocumentsDesc",
      time: "1 dia atrás",
      read: true,
    },
  ]

  const [notificationList, setNotificationList] = useState(notifications)
  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const removeNotification = (id: number) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "info":
        return <Clock className="h-4 w-4 text-primary" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t("common.notifications")}</span>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} {t("common.newNotifications")}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notificationList.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
          ) : (
            notificationList.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {t(notification.titleKey)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{t(notification.descriptionKey)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notificationList.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary cursor-pointer">
              {t("dashboard.viewAll")} {t("common.notifications").toLowerCase()}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"
import { GlobalSearch } from "./global-search"
import { Notifications } from "./notifications"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { useI18n } from "@/lib/i18n"

export function Header() {
  const { t } = useI18n()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-4 ms-auto">
        {/* Global search */}
        <GlobalSearch />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Notifications />

        <UserMenu />
      </div>
    </header>
  )
}

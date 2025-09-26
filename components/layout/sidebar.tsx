"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  ListTodo,
  Users,
  Settings,
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/components/auth/auth-provider"

const navigation = [
  { name: "activities", href: "/activities", icon: ListTodo },
  { name: "claims", href: "/claims", icon: FileText },
  { name: "claim.new", href: "/claims/new", icon: CirclePlus },
  { name: "policies", href: "/policies", icon: Shield },
  { name: "reports", href: "/reports", icon: BarChart3 },
]

const adminNavigation = [{ name: "users", href: "/admin/users", icon: Users }]

const settingsNavigation = [{ name: "settings", href: "/settings", icon: Settings }]

function LogoIcon({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 100 100"
        className={cn("w-full h-full", animated && "animate-spin")}
        style={{ animationDuration: animated ? "8s" : undefined }}
      >
        {/* Outer ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" />

        {/* Globe */}
        <circle cx="50" cy="50" r="30" fill="currentColor" className="text-primary/20" />

        {/* Continents - simplified shapes */}
        <path d="M35 35 Q45 30 55 35 Q60 40 55 45 Q45 50 35 45 Z" fill="currentColor" className="text-primary" />
        <path d="M25 50 Q35 45 45 50 Q40 60 30 65 Q20 60 25 50 Z" fill="currentColor" className="text-primary" />
        <path d="M60 25 Q70 20 75 30 Q70 35 65 40 Q55 35 60 25 Z" fill="currentColor" className="text-primary" />

        {/* Grid lines */}
        <path
          d="M20 50 Q50 40 80 50 Q50 60 20 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary/40"
        />
        <path
          d="M50 20 Q60 50 50 80 Q40 50 50 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary/40"
        />

        {/* Water drop accent */}
        <path d="M70 70 Q75 65 80 70 Q75 80 70 75 Q65 70 70 70 Z" fill="currentColor" className="text-primary/60" />
      </svg>
    </div>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()
  const { user } = useAuth()

  const isAdmin = user?.user_metadata?.role === "admin"

  const renderNavSection = (items: typeof navigation, title?: string) => (
    <div className="space-y-2">
      {title && !collapsed && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">{title}</h3>
        </div>
      )}
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href) &&
              !navigation.some(
                (otherItem) => otherItem.href.length > item.href.length && pathname.startsWith(otherItem.href),
              )

        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 transition-all duration-200",
                collapsed && "justify-center px-0",
                isActive && "bg-primary text-primary-foreground shadow-sm",
                !isActive && "hover:bg-primary/10 hover:text-primary",
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{t(`nav.${item.name}`)}</span>}
            </Button>
          </Link>
        )
      })}
    </div>
  )

  return (
    <div
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-25" : "w-64",
      )}
    >
      <div className="flex items-center justify-center p-6 border-b border-sidebar-border bg-gradient-to-r from-sidebar/50 to-sidebar-accent/20">
        {!collapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <LogoIcon className="w-20 h-20" />
            <div className="text-center">
              <h2 className="text-sm font-semibold text-sidebar-foreground">C. Lewis & Lime Syndicate</h2>
              <p className="text-xs text-sidebar-foreground/60 font-medium">Global Insurance Partnership</p>
            </div>
          </div>
        ) : (
          <LogoIcon className="w-20 h-20" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        {renderNavSection(navigation, "Main")}

        {isAdmin && renderNavSection(adminNavigation, "Administration")}

        {/* Settings Navigation */}
        {renderNavSection(settingsNavigation, "Account")}
      </nav>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-background shadow-md hover:bg-accent transition-colors duration-200"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>
    </div>
  )
}

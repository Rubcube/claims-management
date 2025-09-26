"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Search, FileText, Shield, User, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n"

const searchResults = [
  {
    type: "claim",
    id: "SIN-2024-001",
    title: "claim SIN-2024-001",
    description: "Maria Santos - Colisão",
    href: "/claims/SIN-2024-001",
    icon: FileText,
  },
  {
    type: "policy",
    id: "APL-2024-156",
    title: "Apólice APL-2024-156",
    description: "Maria Santos - Seguro Auto",
    href: "/policies/APL-2024-156",
    icon: Shield,
  },
  {
    type: "cliente",
    id: "maria-santos",
    title: "Maria Santos",
    description: "Cliente - 123.456.789-00",
    href: "/clients/maria-santos",
    icon: User,
  },
  {
    type: "report",
    id: "report-mensal",
    title: "Relatório Mensal",
    description: "Análises e estatísticas",
    href: "/reports",
    icon: BarChart3,
  },
]

export function GlobalSearch() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">{t("common.search")}</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={`${t("common.typeToSearch")}`} />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Sinistros">
            {searchResults
              .filter((item) => item.type === "claim")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Apólices">
            {searchResults
              .filter((item) => item.type === "policy")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Clientes">
            {searchResults
              .filter((item) => item.type === "cliente")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Relatórios">
            {searchResults
              .filter((item) => item.type === "report")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

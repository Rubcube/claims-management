import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

const statusConfig = {
  // Sinistros
  "em-analise": { variant: "secondary" as const, label: "Em Análise" },
  aprovado: { variant: "default" as const, label: "Aprovado" },
  rejeitado: { variant: "destructive" as const, label: "Rejeitado" },
  pendente: { variant: "outline" as const, label: "Pendente" },

  // Apólices
  vigente: { variant: "default" as const, label: "Vigente" },
  cancelada: { variant: "destructive" as const, label: "Cancelada" },
  vencida: { variant: "outline" as const, label: "Vencida" },

  // Prioridades
  baixa: { variant: "outline" as const, label: "Baixa" },
  media: { variant: "secondary" as const, label: "Média" },
  alta: { variant: "default" as const, label: "Alta" },
  urgente: { variant: "destructive" as const, label: "Urgente" },
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig]
  const badgeVariant = variant || config?.variant || "outline"
  const label = config?.label || status

  return (
    <Badge variant={badgeVariant} className={cn("text-xs", className)}>
      {label}
    </Badge>
  )
}

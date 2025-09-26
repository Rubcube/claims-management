"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Filter, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useTranslation } from "@/lib/i18n"

export function AdvancedFilters() {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [produto, setProduto] = useState("all")
  const [status, setStatus] = useState("all")
  const [valorMin, setValorMin] = useState("")
  const [valorMax, setValorMax] = useState("")

  const handleApplyFilters = () => {
    console.log("Aplicando filtros:", { dateRange, produto, status, valorMin, valorMax })
    // Aqui seria implementada a lógica de filtros
  }

  const handleClearFilters = () => {
    setDateRange(undefined)
    setProduto("all")
    setStatus("all")
    setValorMin("")
    setValorMax("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          {t("common.advancedFilters")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("common.advancedFilters")}</DialogTitle>
          <DialogDescription>{t("common.filterDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t("common.period")}</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="produto">{t("common.product")}</Label>
              <Select value={produto} onValueChange={setProduto}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.allProducts")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.allProducts")}</SelectItem>
                  <SelectItem value="auto">{t("common.autoInsurance")}</SelectItem>
                  <SelectItem value="residencial">{t("common.homeInsurance")}</SelectItem>
                  <SelectItem value="vida">{t("common.lifeInsurance")}</SelectItem>
                  <SelectItem value="empresarial">{t("common.businessInsurance")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">{t("common.status")}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.allStatuses")}</SelectItem>
                  <SelectItem value="vigente">{t("common.active")}</SelectItem>
                  <SelectItem value="pendente">{t("common.pending")}</SelectItem>
                  <SelectItem value="cancelada">{t("common.cancelled")}</SelectItem>
                  <SelectItem value="vencida">{t("common.expired")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valorMin">{t("common.minimumValue")}</Label>
              <Input
                id="valorMin"
                placeholder="R$ 0,00"
                value={valorMin}
                onChange={(e) => setValorMin(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="valorMax">{t("common.maximumValue")}</Label>
              <Input
                id="valorMax"
                placeholder="R$ 0,00"
                value={valorMax}
                onChange={(e) => setValorMax(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="w-4 h-4 mr-2" />
            {t("common.clearFilters")}
          </Button>
          <Button onClick={handleApplyFilters}>{t("common.applyFilters")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

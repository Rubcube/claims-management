"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Download, FileSpreadsheet, FileText, File } from "lucide-react"
import { useTranslations } from 'next-intl'

export function ExportDialog() {
  const t = useTranslations()
  const [format, setFormat] = useState("excel")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)

  const handleExport = () => {
    // Simular exportação
    console.log("Exportando relatório:", { format, includeCharts, includeDetails })
    // Aqui seria implementada a lógica real de exportação
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          {t("common.export")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("common.exportReport")}</DialogTitle>
          <DialogDescription>{t("common.chooseFormatAndOptions")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="format">{t("common.exportFormat")}</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF (.pdf)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4" />
                    CSV (.csv)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>{t("common.exportOptions")}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
              <Label htmlFor="charts" className="text-sm font-normal">
                {t("common.includeCharts")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="details" checked={includeDetails} onCheckedChange={setIncludeDetails} />
              <Label htmlFor="details" className="text-sm font-normal">
                {t("common.includeDetails")}
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">{t("common.cancel")}</Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            {t("common.export")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, ClipboardMinus, FileBadge, Image, FileChartPie, ArrowDownToLine } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export function DocumentsTab({ params }: { params: { id: string } }) {
  const { t } = useTranslation()

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <Button variant="link">
          <PlusCircle className="mr-2 h-4 w-4" />

          Upload Document
        </Button>
      </div>

      <div className="flex flex-col gap-6 mt-6">
        <Card className="grow-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#ffece7] rounded flex flex-col items-center justify-center">
                <ClipboardMinus className="text-[#cc3413]"></ClipboardMinus>
              </div>
              <div className="pl-2">
                <CardTitle>
                  Fire Investigation Report
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Uploaded on 11 Sep 2025 by London Fire Brigade
                </CardDescription>
              </div>

              <div className="flex ml-auto gap-2">
                <span className="text-sm text-muted-foreground">
                  2.4 MB
                </span>

                <ArrowDownToLine className="w-5 h-5 text-ring"></ArrowDownToLine>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="grow-1">
          <CardHeader>
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#ebf0ff] rounded flex flex-col items-center justify-center">
                <FileBadge className="text-[#3359cc]"></FileBadge>
              </div>
              <div className="pl-2">
                <CardTitle>
                  Fire Investigation Report
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Uploaded on 11 Sep 2025 by London Fire Brigade
                </CardDescription>
              </div>

              <div className="flex ml-auto gap-2">
                <span className="text-sm text-muted-foreground">
                  2.4 MB
                </span>

                <ArrowDownToLine className="w-5 h-5 text-ring"></ArrowDownToLine>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="grow-1">
          <CardHeader>
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#e8f5ec] rounded flex flex-col items-center justify-center">
                <Image className="text-[#19a34a]"></Image>
              </div>
              <div className="pl-2">
                <CardTitle>
                  Fire Investigation Report
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Uploaded on 11 Sep 2025 by London Fire Brigade
                </CardDescription>
              </div>

              <div className="flex ml-auto gap-2">
                <span className="text-sm text-muted-foreground">
                  2.4 MB
                </span>

                <ArrowDownToLine className="w-5 h-5 text-ring"></ArrowDownToLine>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="grow-1">
          <CardHeader>
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#feeef3] rounded flex flex-col items-center justify-center">
                <FileChartPie className="text-[#de4f7e]"></FileChartPie>
              </div>
              <div className="pl-2">
                <CardTitle>
                  Fire Investigation Report
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Uploaded on 11 Sep 2025 by London Fire Brigade
                </CardDescription>
              </div>

              <div className="flex ml-auto gap-2">
                <span className="text-sm text-muted-foreground">
                  2.4 MB
                </span>

                <ArrowDownToLine className="w-5 h-5 text-ring"></ArrowDownToLine>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

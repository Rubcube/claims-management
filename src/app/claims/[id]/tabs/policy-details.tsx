"use client"

import { CircleIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useTranslations } from 'next-intl'

export function PolicyDetailsTab({ params }: { params: { id: string } }) {
  const t = useTranslations()

  return (
    <div className="mt-6">
      <div className="flex gap-6">
        <Card className="grow-1">
          <CardHeader>
            <CardTitle>
              Coverage Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                    Policy Period:
                </span>

                <span className="text-sm">
                  01 Jan 2025 - 31 Dec 2025
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Sum Insured:
                </span>

                <span className="text-sm">
                  $5,000,000
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Deductible:
                </span>

                <span className="text-sm">
                  $25,000
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Coverage Type:
                </span>

                <span className="text-sm">
                  All Risks Property
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="grow-1">
          <CardHeader>
            <CardTitle>
              Insured Parties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                    Primary Insured:
                </span>

                <span className="text-sm">
                  Acme Corporation Limited
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Additional Insured:
                </span>

                <span className="text-sm">
                  Acme Holdings PLC
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Loss Payee:
                </span>

                <span className="text-sm">
                  First National Bank
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 grow-1">
        <CardHeader>
          <CardTitle>
            Key Exclusions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            <li className="text-sm flex items-center gap-2">
              <CircleIcon className="size-2 fill-muted-foreground"></CircleIcon>
              <span>
                War, invasion, acts of foreign enemies, hostilities
              </span>
            </li>
            <li className="text-sm flex items-center gap-2">
              <CircleIcon className="size-2 fill-muted-foreground"></CircleIcon>
              <span>
                Nuclear risks and radioactive contamination
              </span>
            </li>
            <li className="text-sm flex items-center gap-2">
              <CircleIcon className="size-2 fill-muted-foreground"></CircleIcon>
              <span>
                Wear and tear, gradual deterioration
              </span>
            </li>
            <li className="text-sm flex items-center gap-2">
              <CircleIcon className="size-2 fill-muted-foreground"></CircleIcon>
              <span>
                Cyber risks and data breach
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

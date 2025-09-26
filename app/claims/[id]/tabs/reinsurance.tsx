"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n"

export function ReinsuranceTab({ params }: { params: { id: string } }) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="flex gap-6 mt-6">
        <Card className="grow-1">
          <CardHeader>
            <CardDescription className="font-semibold text-muted-foreground">
              Gross Exposure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              $2,350,000
            </h1>
          </CardContent>
        </Card>

        <Card className="grow-1">
          <CardHeader>
            <CardDescription className="font-semibold text-muted-foreground">
              Net Retention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              $625,000
            </h1>

            <CardDescription className="text-sm">
              25% Share
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="grow-1">
          <CardHeader>
            <CardDescription className="font-semibold text-muted-foreground">
              Reinsured Amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              $1,875,000
            </h1>

            <CardDescription className="text-sm">
              75% Ceded
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="grow-1 mt-6">
        <CardHeader>
          <CardTitle>
            Reinsurance Participations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reinsurer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Share %</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Lime Syndicate</TableCell>
                <TableCell>Net Retention</TableCell>
                <TableCell>25.0%</TableCell>
                <TableCell>$625,000</TableCell>
                <TableCell>$37,500</TableCell>
                <TableCell>$587,500</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Swiss Re</TableCell>
                <TableCell>Quota Share</TableCell>
                <TableCell>30.0%</TableCell>
                <TableCell>$750,000</TableCell>
                <TableCell>$45,000</TableCell>
                <TableCell>$705,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Munich Re</TableCell>
                <TableCell>Quota Share</TableCell>
                <TableCell>25.0%</TableCell>
                <TableCell>$625,000</TableCell>
                <TableCell>$37,500</TableCell>
                <TableCell>$587,500</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hannover Re</TableCell>
                <TableCell>Quota Share</TableCell>
                <TableCell>20.0%</TableCell>
                <TableCell>$500,000</TableCell>
                <TableCell>$30,000</TableCell>
                <TableCell>$470,000</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell>100.0%</TableCell>
                <TableCell>$2,500,000</TableCell>
                <TableCell>$150,000</TableCell>
                <TableCell>$2,350,000</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

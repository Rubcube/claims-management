"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/ui/table"
import { useTranslations } from 'next-intl'

export function AuditTrailTab({ params }: { params: { id: string } }) {
  const t = useTranslations()

  return (
    <div>
      <Card className="grow-1 mt-6">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>09 Sep 2025 14:32</TableCell>
                <TableCell>James Mitchell</TableCell>
                <TableCell>Claim Created</TableCell>
                <TableCell>Initial claim registration from broker notification</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>09 Sep 2025 15:15</TableCell>
                <TableCell>James Mitchell</TableCell>
                <TableCell>Reserve Set</TableCell>
                <TableCell>Initial reserve established at $2,500,000</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>10 Sep 2025 09:45</TableCell>
                <TableCell>Sarah Johnson</TableCell>
                <TableCell>Activity Created</TableCell>
                <TableCell>Loss adjuster appointment activity assigned</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>11 Sep 2025 16:20</TableCell>
                <TableCell>System</TableCell>
                <TableCell>Document Added</TableCell>
                <TableCell>Fire investigation report uploaded</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>12 Sep 2025 11:30</TableCell>
                <TableCell>Sarah Johnson</TableCell>
                <TableCell>Payment Made</TableCell>
                <TableCell>Interim payment of $150,000 processed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

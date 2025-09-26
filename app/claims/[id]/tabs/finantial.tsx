"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const finantialData = [
  {
    id: 1,
    date: "2025-09-26",
    type: "Initial Reserve",
    description: "Initial reserve establishment",
    amount: "$2,500,000",
    user: "James Mitchell"
  },
  {
    id: 2,
    date: "2025-10-16",
    type: "Payment",
    description: "Interim payment for emergency repairs",
    amount: "$150,000",
    user: "Sarah Johnson"
  }
]

export function FinantialTab({ params }: { params: { id: string } }) {
  const { t } = useTranslation()

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <Button variant="link">
          <PlusCircle className="mr-2 h-4 w-4" />

          New Movement
        </Button>
      </div>
      <div className="flex gap-6 mt-6">
        <Card className="grow-1">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Outstanding Reserve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              $2,350,000
            </h1>

            <CardDescription>
              Property Damage
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="grow-1">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              $150,000
            </h1>

            <CardDescription>
              Interim Payments
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="grow-1">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Recoveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              $150,000
            </h1>

           <CardDescription>
              Remaining Reserve
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="grow-1">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Incurred
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              $2,500,000
            </h1>

            <CardDescription>
              Remaining Reserve
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finantialData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.date}</TableCell>
                    <TableCell>
                      <Badge
                        className="w-full"
                        variant={ data.type === "Initial Reserve" ? "default" : "secondary" }
                      >
                        {data.type}
                      </Badge>

                    </TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>{data.amount}</TableCell>
                    <TableCell>{data.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

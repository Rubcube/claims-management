"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ActionsDropdown } from "@/components/ui/actions-dropdown"
import { Search, Filter, Plus } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Policy } from "@/lib/types/policy"
import { getPolicyCoverageTypeLabel } from "@/lib/types/enums"

export default function PoliciesPage() {
  const { t } = useTranslation()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("policies").select("*").order("created_date", { ascending: false })

      if (error) throw error

      console.log("[v0] Policies data received:", data)
      setPolicies(data || [])
    } catch (err) {
      console.error("Error fetching policies:", err)
      setError("Failed to load policies")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (policyId: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("policies").delete().eq("id", policyId)

      if (error) throw error

      // Remove from local state
      setPolicies((prev) => prev.filter((policy) => policy.id.toString() !== policyId))
    } catch (err) {
      console.error("Error deleting policy:", err)
      alert("Failed to delete policy")
    }
  }

  const filteredPolicies = policies.filter(
    (policy) =>
      (policy.policy_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (policy.named_insured || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (policy.binder_ref || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusVariant = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "secondary" // Not started
    if (now > end) return "destructive" // Expired
    return "default" // Active
  }

  const getStatusLabel = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "Not Started"
    if (now > end) return "Expired"
    return "Active"
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading policies...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("policies.title")}</h1>
            <p className="text-muted-foreground">{t("policies.subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/policies/new">
              <Plus className="w-4 h-4 mr-2" />
              New Policy
            </Link>
          </Button>
        </div>

        {/* Filtros e busca */}
        <Card>
          <CardHeader>
            <CardTitle>{t("common.filter")}</CardTitle>
            <CardDescription>{t("common.filterDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder={`${t("common.search")} ${t("common.number").toLowerCase()}, ${t("common.client").toLowerCase()}...`}
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                {t("common.search")}
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                {t("common.advancedFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error state */}
        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchPolicies}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de apólices */}
        <Card>
          <CardHeader>
            <CardTitle>{t("policies.title")}</CardTitle>
            <CardDescription>
              {t("common.quantity")}: {filteredPolicies.length} {t("policies.title").toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPolicies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No policies found matching your search." : "No policies found."}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link href="/policies/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Policy
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("policies.policyNumber")}</TableHead>
                    <TableHead>Named Insured</TableHead>
                    <TableHead>Coverage Type</TableHead>
                    <TableHead>
                      {t("policies.startDate")} / {t("policies.endDate")}
                    </TableHead>
                    <TableHead>Sum Insured</TableHead>
                    <TableHead>Deductible</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead>Binder Ref</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{policy.policy_number}</TableCell>
                      <TableCell>{policy.named_insured}</TableCell>
                      <TableCell>{getPolicyCoverageTypeLabel(policy.coverage_type)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(policy.period_start)}</div>
                          <div className="text-muted-foreground">
                            {t("common.until")} {formatDate(policy.period_end)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(policy.sum_insured)}</TableCell>
                      <TableCell>{policy.deductible ? formatCurrency(policy.deductible) : "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(policy.period_start, policy.period_end)}>
                          {getStatusLabel(policy.period_start, policy.period_end)}
                        </Badge>
                      </TableCell>
                      <TableCell>{policy.binder_ref || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <ActionsDropdown
                          viewHref={`/policies/${policy.id}`}
                          editHref={`/policies/${policy.id}/edit`}
                          onDelete={() => handleDelete(policy.id.toString())}
                          showActivities={false}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

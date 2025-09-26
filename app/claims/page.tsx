"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ActionsDropdown } from "@/components/ui/actions-dropdown"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Claim } from "@/lib/types/activity"
import { ClaimStatus, getClaimStatusLabel } from "@/lib/types/enums"

export default function ClaimsPage() {
  const { t } = useTranslation()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("claims")
        .select(`
          *,
          policy:policies(*)
        `)
        .order("created_date", { ascending: false })

      if (error) throw error

      console.log("[v0] Claims data received:", data)
      setClaims(data || [])
    } catch (err) {
      console.error("Error fetching claims:", err)
      setError("Failed to load claims")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (claimId: string) => {
    if (!confirm("Are you sure you want to delete this claim?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("claims").delete().eq("id", claimId)

      if (error) throw error

      // Remove from local state
      setClaims((prev) => prev.filter((claim) => claim.id.toString() !== claimId))
    } catch (err) {
      console.error("Error deleting claim:", err)
      alert("Failed to delete claim")
    }
  }

  const filteredClaims = claims.filter(
    (claim) =>
      (claim.claim_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.policy?.policy_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.policy?.named_insured || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "green_darker"
      case "UnderReview":
        return "yellow"
      case "Closed":
        return "red"
      case "SoftClosed":
        return "red"
      case "Approved":
        return "green"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return "N/A"
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    })
    return formatter.format(amount)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading claims...</p>
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
            <h1 className="text-3xl font-bold text-foreground">{t("claims.title")}</h1>
            <p className="text-muted-foreground">{t("claims.subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/claims/new">
              <Plus className="w-4 h-4 mr-2" />
              {t("claims.newClaim")}
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
                  placeholder={`${t("common.search")} ${t("claims.claimNumber").toLowerCase()}, ${t("policies.policyNumber").toLowerCase()}...`}
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                <Button onClick={fetchClaims}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de claims */}
        <Card>
          <CardHeader>
            <CardTitle>{t("claims.title")}</CardTitle>
            <CardDescription>
              {t("common.quantity")}: {filteredClaims.length} {t("claims.title").toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredClaims.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No claims found matching your search." : "No claims found."}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link href="/claims/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Claim
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("common.description")}</TableHead>
                    <TableHead>{t("claims.claimNumber")}</TableHead>
                    <TableHead>{t("policies.policyNumber")}</TableHead>
                    <TableHead>Named Insured</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>{t("claims.incidentDate")}</TableHead>
                    <TableHead>{t("claims.dateReported")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>{claim.description || "N/A"}</TableCell>
                      <TableCell className="font-semibold">{claim.claim_number}</TableCell>
                      <TableCell>{claim.policy?.policy_number || "N/A"}</TableCell>
                      <TableCell>{claim.policy?.named_insured || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className="w-full" variant={getStatusVariant(claim.status)}>
                          {getClaimStatusLabel(ClaimStatus[`${claim.status}`])}
                        </Badge>
                      </TableCell>
                      <TableCell>{claim.currency || "N/A"}</TableCell>
                      <TableCell>{claim.coverage || "N/A"}</TableCell>
                      <TableCell>{formatDate(claim.date_of_loss)}</TableCell>
                      <TableCell>{formatDate(claim.reported_date)}</TableCell>
                      <TableCell className="text-right">
                        <ActionsDropdown
                          viewHref={`/claims/${claim.id}`}
                          editHref={`/claims/${claim.id}/edit`}
                          activitiesHref={`/claims/${claim.id}/activities`}
                          onDelete={() => handleDelete(claim.id.toString())}
                          showActivities={true}
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

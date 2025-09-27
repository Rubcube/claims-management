"use client"

import { MainLayout } from "@/app/components/layout/main-layout"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useTranslations } from 'next-intl'
import { GeneralInformationTab } from "./tabs/general-information"
import { ActivitiesTab } from "./tabs/activities"
import { AuditTrailTab } from "./tabs/audit-trail"
import { DocumentsTab } from "./tabs/documents"
import { FinantialTab } from "./tabs/finantial"
import { PolicyDetailsTab } from "./tabs/policy-details"
import { ReinsuranceTab } from "./tabs/reinsurance"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Claim } from "@/lib/types/activity"

export default function ClaimDetailsPage({ params }: { params: { id: string } }) {
  const t = useTranslations()
  const router = useRouter()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClaim()
  }, [params.id])

  const fetchClaim = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("claims")
        .select(`
          *,
          policy:policies(*)
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error

      console.log("[v0] Claim data received:", data)
      setClaim(data)
    } catch (err) {
      console.error("Error fetching claim:", err)
      setError("Failed to load claim")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this claim?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("claims").delete().eq("id", params.id)

      if (error) throw error

      router.push("/claims")
    } catch (err) {
      console.error("Error deleting claim:", err)
      alert("Failed to delete claim")
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "default"
      case "Under Review":
        return "secondary"
      case "Open":
        return "outline"
      case "Closed":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading claim...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !claim) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Claim not found"}</p>
            <Button asChild>
              <Link href="/claims">Back to Claims</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/claims">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{claim.claim_number}</h1>
              <p className="text-muted-foreground">Claim Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/claims/${claim.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Claim summary */}
        <div className="flex gap-[150px]">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <span className="text-muted-foreground">Insured:</span>
              <span>{claim.policy?.named_insured || "N/A"}</span>
            </div>

            <div className="flex gap-4">
              <span className="text-muted-foreground">Loss date:</span>
              <span>{formatDate(claim.date_of_loss)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <span className="text-muted-foreground">Policy:</span>
              <span>{claim.policy?.policy_number || "N/A"}</span>
            </div>

            <div className="flex gap-4">
              <span className="text-muted-foreground">Notified:</span>
              <span>{formatDate(claim.reported_date)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={getStatusVariant(claim.status)}>{claim.status}</Badge>
            </div>

            <div className="flex gap-4">
              <span className="text-muted-foreground">Currency:</span>
              <span>{claim.currency || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general_information">
          <TabsList>
            <TabsTrigger value="general_information">{t("claims.tabs.generalInformation")}</TabsTrigger>
            <TabsTrigger value="finantial_movements">{t("claims.tabs.finantial")}</TabsTrigger>
            <TabsTrigger value="activities">{t("claims.tabs.activities")}</TabsTrigger>
            <TabsTrigger value="policy_details">{t("claims.tabs.policyDetails")}</TabsTrigger>
            <TabsTrigger value="reinsurance_placement_details">{t("claims.tabs.reinsurance")}</TabsTrigger>
            <TabsTrigger value="audit_trail">{t("claims.tabs.auditTrail")}</TabsTrigger>
            <TabsTrigger value="documents">{t("claims.tabs.documents")}</TabsTrigger>
          </TabsList>
          <TabsContent value="general_information">
            <GeneralInformationTab params={{ id: params.id }} claim={claim} />
          </TabsContent>
          <TabsContent value="finantial_movements">
            <FinantialTab params={{ id: params.id }} claim={claim} />
          </TabsContent>
          <TabsContent value="activities">
            <ActivitiesTab params={{ id: params.id }} claim={claim} />
          </TabsContent>
          <TabsContent value="policy_details">
            <PolicyDetailsTab params={{ id: params.id }} claim={claim} />
          </TabsContent>
          <TabsContent value="reinsurance_placement_details">
            <ReinsuranceTab params={{ id: params.id }} claim={claim} />
          </TabsContent>
          <TabsContent value="audit_trail">
            <AuditTrailTab params={{ id: params.id }} claim={claim} />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab params={{ id: params.id }} claim={claim} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

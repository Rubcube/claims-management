"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import type { Claim } from "@/lib/types/activity"

interface GeneralInformationTabProps {
  params: { id: string }
  claim: Claim
}

export function GeneralInformationTab({ params, claim }: GeneralInformationTabProps) {
  const { t } = useTranslation()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="flex gap-6 mt-6">
      <div className="flex flex-col gap-6 basis-2/3">
        <Card>
          <CardHeader>
            <CardTitle>Risk Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="flex flex-col mr-55">
                <span className="text-sm">{claim.policy?.coverage_type || "N/A"}</span>
                <span className="text-sm font-semibold text-muted-foreground">Coverage Type</span>
              </div>

              <div className="flex flex-col mr-auto">
                <span className="text-sm">{claim.policy?.policy_number || "N/A"}</span>
                <span className="text-sm font-semibold text-muted-foreground">Policy Number</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm">{claim.coverage || "N/A"}</span>
                <span className="text-sm font-semibold text-muted-foreground">Coverage</span>
              </div>
            </div>

            <div className="flex mt-4">
              <div className="flex flex-col mr-14">
                <span className="text-sm">{claim.currency || "N/A"}</span>
                <span className="text-sm font-semibold text-muted-foreground">Currency</span>
              </div>

              <div className="flex flex-col mr-auto">
                <span className="text-sm">{claim.policy?.binder_ref || "N/A"}</span>
                <span className="text-sm font-semibold text-muted-foreground">Binder / Contract Ref</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm">{claim.status}</span>
                <span className="text-sm font-semibold text-muted-foreground">Status</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col mr-16">
                <span className="text-sm">{claim.policy?.named_insured || "N/A"}</span>
                <span className="text-sm font-semibold text-muted-foreground">Insured / Policyholder Name</span>
              </div>

              <div className="flex flex-col mr-auto">
                <span className="text-sm">{claim.claim_number}</span>
                <span className="text-sm font-semibold text-muted-foreground">Claim Number</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm">{formatDate(claim.date_of_loss)}</span>
                <span className="text-sm font-semibold text-muted-foreground">Date of Loss</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col mr-44">
                <span className="text-sm">{formatDate(claim.reported_date)}</span>
                <span className="text-sm font-semibold text-muted-foreground">Date Notified</span>
              </div>

              <div className="flex flex-col mr-auto">
                <span className="text-sm">{claim.cause_of_loss || "N/A"}</span>
                <span className="text-sm font-semibold text-muted-foreground">Cause of Loss</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm">{formatDate(claim.created_date)}</span>
                <span className="text-sm font-semibold text-muted-foreground">Created Date</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 basis-1/3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Loss Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="flex flex-col items-center">
                <p className="text-sm">{claim.description || "No description available"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

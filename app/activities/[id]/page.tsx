"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Activity } from "@/lib/types/activity"

interface ActivityDetailPageProps {
  params: { id: string }
}

export default function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const router = useRouter()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActivity()
  }, [params.id])

  const fetchActivity = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("activities")
        .select(`
          *,
          claim:claims(
            *,
            policy:policies(*)
          )
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error
      setActivity(data)
    } catch (err) {
      console.error("Error fetching activity:", err)
      setError("Failed to load activity")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").delete().eq("id", params.id)

      if (error) throw error

      router.push("/activities")
    } catch (err) {
      console.error("Error deleting activity:", err)
      alert("Failed to delete activity")
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "InProgress":
        return "secondary"
      case "Pending":
        return "outline"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading activity...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !activity) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Activity not found"}</p>
            <Button asChild>
              <Link href="/activities">Back to Activities</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Details</h1>
              <p className="text-muted-foreground">View and manage activity information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/activities/${activity.id}/edit`}>
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

        {/* Activity Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Information</CardTitle>
              <CardDescription>Basic details about this activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(activity.status)}>{activity.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p className="mt-1 font-medium">{activity.assigned_to}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="mt-1">{activity.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <p className="mt-1">{formatDate(activity.due_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p className="mt-1">{formatDate(activity.created_date)}</p>
              </div>
              {activity.modified_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modified Date</label>
                  <p className="mt-1">{formatDate(activity.modified_date)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Claim</CardTitle>
              <CardDescription>Information about the associated claim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.claim ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Claim Number</label>
                    <p className="mt-1 font-medium">{activity.claim.claim_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <p className="mt-1">{activity.claim.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coverage</label>
                    <p className="mt-1">{activity.claim.coverage || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Loss</label>
                    <p className="mt-1">
                      {activity.claim.date_of_loss ? formatDate(activity.claim.date_of_loss) : "N/A"}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" asChild>
                      <Link href={`/claims/${activity.claim.id}`}>View Claim Details</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No claim information available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {activity.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{activity.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

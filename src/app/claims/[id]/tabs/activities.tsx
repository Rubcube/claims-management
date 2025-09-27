"use client"

import { Button } from "@/app/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { useTranslations } from 'next-intl'
import { useState, useEffect } from "react"
import type { Activity } from "@/lib/types/activity"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export function ActivitiesTab({ params }: { params: { id: string } }) {
  const t = useTranslations()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract claim code from the ID parameter (assuming format like CLM-20245-001)
  const claimCode = params.id

  useEffect(() => {
    fetchActivitiesByClaimCode()
  }, [claimCode])

  const fetchActivitiesByClaimCode = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("claim_code", claimCode)
        .order("created_date", { ascending: false })

      if (error) throw error

      setActivities(data || [])
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").delete().eq("id", activityId)

      if (error) throw error

      // Remove from local state
      setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
    } catch (err) {
      console.error("Error deleting activity:", err)
      alert("Failed to delete activity")
    }
  }

  const getStatusVariant = (status: Activity["status"]) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
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

  const calculateSLA = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return "Overdue"
    if (days <= 2) return "At Risk"
    return "On Track"
  }

  const getSLAColor = (slaStatus: string) => {
    switch (slaStatus) {
      case "Overdue":
        return "text-destructive"
      case "At Risk":
        return "text-yellow-600"
      case "On Track":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex justify-end">
          <Button variant="link" disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Activity
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading activities...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex justify-end">
          <Button variant="link">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Activity
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchActivitiesByClaimCode}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex justify-end">
        <Button variant="link" asChild>
          <Link href={`/activities/new?claimCode=${claimCode}`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Activity
          </Link>
        </Button>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No activities found for this claim.</p>
              <Button asChild>
                <Link href={`/activities/new?claimCode=${claimCode}`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create First Activity
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        activities.map((activity) => {
          const slaStatus = calculateSLA(activity.due_date)

          return (
            <Card key={activity.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription className="mt-1">{activity.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={getStatusVariant(activity.status)}>{activity.status}</Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/activities/${activity.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-8">
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-sm font-medium">{activity.assignee}</span>
                  <span className="text-sm text-muted-foreground">Assigned to</span>
                </div>

                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-sm font-medium">{activity.role}</span>
                  <span className="text-sm text-muted-foreground">Role</span>
                </div>

                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-sm font-medium">{formatDate(activity.due_date)}</span>
                  <span className="text-sm text-muted-foreground">Due Date</span>
                </div>

                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className={`text-sm font-medium ${getSLAColor(slaStatus)}`}>{slaStatus}</span>
                  <span className="text-sm text-muted-foreground">SLA Status</span>
                </div>

                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-sm font-medium">{activity.product_lob}</span>
                  <span className="text-sm text-muted-foreground">Product LOB</span>
                </div>

                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-sm font-medium">{formatDate(activity.created_date)}</span>
                  <span className="text-sm text-muted-foreground">Created</span>
                </div>

                {activity.related_document_id && (
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-sm font-medium">{activity.related_document_id}</span>
                    <span className="text-sm text-muted-foreground">Document ID</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}

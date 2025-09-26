"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ActionsDropdown } from "@/components/ui/actions-dropdown"
import { Search, Filter, Plus } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import type { Activity } from "@/lib/types/activity"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ActivitiesPage() {
  const { t } = useTranslation()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
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
        .order("created_date", { ascending: false })

      if (error) throw error

      console.log("[v0] Activities data received:", data)
      setActivities(data || [])
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("Could not find the table 'public.activities' in the schema cache")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (activityId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").delete().eq("id", activityId)

      if (error) throw error

      // Remove from local state
      setActivities((prev) => prev.filter((activity) => activity.id.toString() !== activityId))
    } catch (err) {
      console.error("Error deleting activity:", err)
      alert("Failed to delete activity")
    }
  }

  const filteredActivities = activities.filter(
    (activity) =>
      (activity.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.claim?.claim_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.assigned_to || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.claim?.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "InProgress":
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

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const calculateSLA = (dueDate: string) => {
    if (!dueDate) return "N/A"
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return `${days} days`
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading activities...</p>
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
            <h1 className="text-3xl font-bold text-foreground">{t("activities.title")}</h1>
            <p className="text-muted-foreground">{t("activities.subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/activities/new">
              <Plus className="w-4 h-4 mr-2" />
              New Activity
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
                  placeholder={`${t("common.search")}...`}
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
                <Button onClick={fetchActivities}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de activities */}
        <Card>
          <CardHeader>
            <CardTitle>List of {t("activities.title")}</CardTitle>
            <CardDescription>Total of {filteredActivities.length} activities found</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No activities found matching your search." : "No activities found."}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link href="/activities/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Activity
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Claim Number</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.description || "N/A"}</TableCell>
                      <TableCell className="font-semibold">{activity.claim?.claim_number || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(activity.assigned_to)}</AvatarFallback>
                            </Avatar>
                          </Button>
                          <div className="flex flex-col">
                            <span className="font-medium">{activity.assigned_to || "Unassigned"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{activity.role || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className="w-full" variant={getStatusVariant(activity.status)}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(activity.due_date)}</TableCell>
                      <TableCell>{calculateSLA(activity.due_date)}</TableCell>
                      <TableCell className="text-right">
                        <ActionsDropdown
                          viewHref={`/activities/${activity.id}`}
                          editHref={`/activities/${activity.id}/edit`}
                          onDelete={() => handleDelete(activity.id.toString())}
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

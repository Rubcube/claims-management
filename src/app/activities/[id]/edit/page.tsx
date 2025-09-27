"use client"

import type React from "react"

import { MainLayout } from "@/app/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useTranslations } from 'next-intl'
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { Activity, UpdateActivityData, Claim } from "@/lib/types/activity"
import { ActivityStatus, ActivityRole, getActivityStatusLabel, getActivityRoleLabel } from "@/lib/types/enums"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface EditActivityPageProps {
  params: {
    id: string
  }
}

export default function EditActivityPage({ params }: EditActivityPageProps) {
  const t = useTranslations()
  const router = useRouter()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    claim_id: 0,
    assignee: "",
    role: ActivityRole.Adjuster,
    due_date: "",
    description: "",
    status: ActivityStatus.InProgress,
    related_document_id: "",
  })

  useEffect(() => {
    fetchActivity()
    fetchClaims()
  }, [params.id])

  const fetchActivity = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("activities")
        .select(`
          *,
          claim:claims(*)
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error

      setActivity(data)
      setFormData({
        title: data.title,
        claim_id: data.claim_id,
        assignee: data.assignee,
        role: data.role,
        due_date: data.due_date.split("T")[0], // Format for date input
        description: data.description || "",
        status: data.status,
        related_document_id: data.related_document_id || "",
      })
    } catch (err) {
      console.error("Error fetching activity:", err)
      setError("Failed to load activity")
    } finally {
      setLoading(false)
    }
  }

  const fetchClaims = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("claims")
        .select("id, title, claim_number, insured_name")
        .order("claim_number")

      if (error) throw error
      setClaims(data || [])
    } catch (err) {
      console.error("Error fetching claims:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()

      const updateData: UpdateActivityData = {
        ...formData,
        modified_by: "Current User", // In a real app, this would come from auth
        modified_date: new Date().toISOString(),
      }

      const { error } = await supabase.from("activities").update(updateData).eq("id", params.id)

      if (error) throw error

      router.push("/activities")
    } catch (err) {
      console.error("Error updating activity:", err)
      setError("Failed to update activity")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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

  if (error && !activity) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/activities">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Activities
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Activity</h1>
            <p className="text-muted-foreground">Update activity details</p>
          </div>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
            <CardDescription>Update the information for this activity</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claim_id">Claim</Label>
                  <Select
                    value={formData.claim_id.toString()}
                    onValueChange={(value) => handleInputChange("claim_id", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim" />
                    </SelectTrigger>
                    <SelectContent>
                      {claims.map((claim) => (
                        <SelectItem key={claim.id} value={claim.id.toString()}>
                          {claim.claim_number} - {claim.insured_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={formData.assignee}
                    onChange={(e) => handleInputChange("assignee", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role.toString()}
                    onValueChange={(value) => handleInputChange("role", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ActivityRole.Adjuster.toString()}>
                        {getActivityRoleLabel(ActivityRole.Adjuster)}
                      </SelectItem>
                      <SelectItem value={ActivityRole.Surveyor.toString()}>
                        {getActivityRoleLabel(ActivityRole.Surveyor)}
                      </SelectItem>
                      <SelectItem value={ActivityRole.Lawyer.toString()}>
                        {getActivityRoleLabel(ActivityRole.Lawyer)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange("due_date", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status.toString()}
                    onValueChange={(value) => handleInputChange("status", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ActivityStatus.Pending.toString()}>
                        {getActivityStatusLabel(ActivityStatus.Pending)}
                      </SelectItem>
                      <SelectItem value={ActivityStatus.InProgress.toString()}>
                        {getActivityStatusLabel(ActivityStatus.InProgress)}
                      </SelectItem>
                      <SelectItem value={ActivityStatus.Completed.toString()}>
                        {getActivityStatusLabel(ActivityStatus.Completed)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="related_document_id">Related Document ID</Label>
                  <Input
                    id="related_document_id"
                    value={formData.related_document_id}
                    onChange={(e) => handleInputChange("related_document_id", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  placeholder="Enter activity description..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/activities">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

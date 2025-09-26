"use client"

import type React from "react"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Claim } from "@/lib/types/activity"

export default function NewActivityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [claims, setClaims] = useState<Claim[]>([])
  const [formData, setFormData] = useState({
    claim_id: "",
    description: "",
    status: "Pending",
    role: "ClaimsHandler",
    assigned_to: "",
    due_date: "",
  })

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("claims")
        .select("id, claim_number, description")
        .order("created_date", { ascending: false })

      if (error) throw error
      setClaims(data || [])
    } catch (err) {
      console.error("Error fetching claims:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").insert([
        {
          claim_id: Number.parseInt(formData.claim_id),
          description: formData.description,
          status: formData.status,
          role: formData.role,
          assigned_to: formData.assigned_to,
          due_date: formData.due_date,
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString(),
        },
      ])

      if (error) throw error

      router.push("/activities")
    } catch (err) {
      console.error("Error creating activity:", err)
      alert("Failed to create activity")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/activities">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">New Activity</h1>
            <p className="text-muted-foreground">Create a new activity for a claim</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
            <CardDescription>Fill in the information below to create a new activity</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="claim_id">Claim *</Label>
                  <Select value={formData.claim_id} onValueChange={(value) => handleInputChange("claim_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a claim" />
                    </SelectTrigger>
                    <SelectContent>
                      {claims.map((claim) => (
                        <SelectItem key={claim.id} value={claim.id.toString()}>
                          {claim.claim_number} - {claim.description?.substring(0, 50)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To *</Label>
                  <Input
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => handleInputChange("assigned_to", e.target.value)}
                    placeholder="Enter assignee name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ClaimsHandler">Claims Handler</SelectItem>
                      <SelectItem value="Adjuster">Adjuster</SelectItem>
                      <SelectItem value="Investigator">Investigator</SelectItem>
                      <SelectItem value="LegalCounsel">Legal Counsel</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="InProgress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date *</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange("due_date", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter activity description"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Create Activity"}
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

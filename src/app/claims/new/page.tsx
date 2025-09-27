"use client"

import type React from "react"

import { MainLayout } from "@/app/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Policy } from "@/lib/types/policy"

export default function NewClaimPage() {
  const t = useTranslations()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [formData, setFormData] = useState({
    policy_id: "",
    claim_number: "",
    description: "",
    status: "Open",
    currency: "USD",
    coverage: "",
    cause_of_loss: "",
    date_of_loss: "",
    reported_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchPolicies()
    generateClaimNumber()
  }, [])

  const fetchPolicies = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("policies").select("*").order("policy_number")

      if (error) throw error
      setPolicies(data || [])
    } catch (err) {
      console.error("Error fetching policies:", err)
    }
  }

  const generateClaimNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    setFormData((prev) => ({ ...prev, claim_number: `CLM-${year}-${random}` }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("claims").insert([
        {
          policy_id: Number.parseInt(formData.policy_id),
          claim_number: formData.claim_number,
          description: formData.description,
          status: formData.status,
          currency: formData.currency,
          coverage: formData.coverage,
          cause_of_loss: formData.cause_of_loss,
          date_of_loss: formData.date_of_loss,
          reported_date: formData.reported_date,
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString(),
        },
      ])

      if (error) throw error

      router.push("/claims")
    } catch (err) {
      console.error("Error creating claim:", err)
      alert("Failed to create claim")
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
        {/* Header da página */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("claims.newClaim")}</h1>
            <p className="text-muted-foreground">Create a new claim in the system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("claims.claimDetails")}</CardTitle>
                <CardDescription>Fill in the basic claim information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="claim_number">{t("claims.claimNumber")}</Label>
                      <Input
                        id="claim_number"
                        value={formData.claim_number}
                        onChange={(e) => handleInputChange("claim_number", e.target.value)}
                        placeholder="Auto-generated"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy_id">{t("claims.policyNumber")}</Label>
                      <Select
                        value={formData.policy_id}
                        onValueChange={(value) => handleInputChange("policy_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy" />
                        </SelectTrigger>
                        <SelectContent>
                          {policies.map((policy) => (
                            <SelectItem key={policy.id} value={policy.id.toString()}>
                              {policy.policy_number} - {policy.named_insured}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cause_of_loss">Cause of Loss</Label>
                      <Select
                        value={formData.cause_of_loss}
                        onValueChange={(value) => handleInputChange("cause_of_loss", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cause" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fire">Fire</SelectItem>
                          <SelectItem value="Theft">Theft</SelectItem>
                          <SelectItem value="Flood">Flood</SelectItem>
                          <SelectItem value="Collision">Collision</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date_of_loss">{t("claims.incidentDate")}</Label>
                      <Input
                        id="date_of_loss"
                        type="date"
                        value={formData.date_of_loss}
                        onChange={(e) => handleInputChange("date_of_loss", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="BRL">BRL</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="coverage">Coverage</Label>
                      <Select value={formData.coverage} onValueChange={(value) => handleInputChange("coverage", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coverage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Property">Property</SelectItem>
                          <SelectItem value="Liability">Liability</SelectItem>
                          <SelectItem value="Auto">Auto</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reported_date">Date Reported</Label>
                    <Input
                      id="reported_date"
                      type="date"
                      value={formData.reported_date}
                      onChange={(e) => handleInputChange("reported_date", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">{t("common.description")}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe what happened in detail..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Creating..." : "Create Claim"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/claims">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informações adicionais */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status and Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">{t("common.status")}</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

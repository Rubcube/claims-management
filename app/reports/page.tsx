"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExportDialog } from "@/components/reports/export-dialog"
import { AdvancedFilters } from "@/components/reports/advanced-filters"
import { useTranslation } from "@/lib/i18n"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Calendar, TrendingUp, DollarSign, FileText, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Claim } from "@/lib/types/activity"
import type { Policy } from "@/lib/types/policy"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]

export default function ReportsPage() {
  const { t } = useTranslation()
  const [claims, setClaims] = useState<Claim[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Fetch claims with policy data
      const { data: claimsData, error: claimsError } = await supabase
        .from("claims")
        .select(`
          *,
          policy:policies(*)
        `)
        .order("created_date", { ascending: false })

      if (claimsError) throw claimsError

      // Fetch policies
      const { data: policiesData, error: policiesError } = await supabase
        .from("policies")
        .select("*")
        .order("created_date", { ascending: false })

      if (policiesError) throw policiesError

      console.log("[v0] Claims data received:", claimsData)
      console.log("[v0] Policies data received:", policiesData)

      setClaims(claimsData || [])
      setPolicies(policiesData || [])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load reports data")
    } finally {
      setLoading(false)
    }
  }

  // Calculate KPIs from real data
  const calculateKPIs = () => {
    const totalPolicies = policies.length
    const totalClaims = claims.length
    const totalSumInsured = policies.reduce((sum, policy) => sum + (policy.sum_insured || 0), 0)
    const activePolicies = policies.filter((policy) => {
      const now = new Date()
      const start = new Date(policy.period_start)
      const end = new Date(policy.period_end)
      return now >= start && now <= end
    }).length

    const approvedClaims = claims.filter((claim) => claim.status === "Approved" || claim.status === "Paid").length
    const approvalRate = totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0

    return {
      totalRevenue: totalSumInsured,
      totalPolicies,
      totalClaims,
      activePolicies,
      approvalRate,
    }
  }

  // Generate claims by month data
  const getClaimsByMonth = () => {
    const monthlyData: { [key: string]: { quantity: number; approved: number; rejected: number } } = {}

    claims.forEach((claim) => {
      if (claim.created_date) {
        const month = new Date(claim.created_date).toLocaleDateString("en-US", { month: "short" }).toLowerCase()
        if (!monthlyData[month]) {
          monthlyData[month] = { quantity: 0, approved: 0, rejected: 0 }
        }
        monthlyData[month].quantity++

        if (claim.status === "Approved" || claim.status === "Paid") {
          monthlyData[month].approved++
        } else if (claim.status === "Closed") {
          monthlyData[month].rejected++
        }
      }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      mes: month,
      quantidade: data.quantity,
      aprovados: data.approved,
      rejeitados: data.rejected,
    }))
  }

  // Generate claims by type data
  const getClaimsByType = () => {
    const typeData: { [key: string]: number } = {}

    claims.forEach((claim) => {
      const type = claim.cause_of_loss || "Other"
      typeData[type] = (typeData[type] || 0) + 1
    })

    const total = claims.length
    return Object.entries(typeData).map(([type, quantity]) => ({
      tipo: type.toLowerCase(),
      quantidade: quantity,
      percentual: total > 0 ? Math.round((quantity / total) * 100) : 0,
    }))
  }

  // Generate policies by month data
  const getPoliciesByMonth = () => {
    const monthlyData: { [key: string]: { policies: number; sumInsured: number } } = {}

    policies.forEach((policy) => {
      if (policy.created_date) {
        const month = new Date(policy.created_date).toLocaleDateString("en-US", { month: "short" }).toLowerCase()
        if (!monthlyData[month]) {
          monthlyData[month] = { policies: 0, sumInsured: 0 }
        }
        monthlyData[month].policies++
        monthlyData[month].sumInsured += policy.sum_insured || 0
      }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      mes: month,
      policies: data.policies,
      premios: data.sumInsured,
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const kpis = calculateKPIs()
  const claimsByMonth = getClaimsByMonth()
  const claimsByType = getClaimsByType()
  const policiesByMonth = getPoliciesByMonth()

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchData}>Try Again</Button>
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
            <h1 className="text-3xl font-bold text-foreground">{t("reports.title")}</h1>
            <p className="text-muted-foreground">{t("reports.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              {t("common.period")}
            </Button>
            <AdvancedFilters />
            <ExportDialog />
          </div>
        </div>

        {/* KPIs principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sum Insured</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Shield className="w-3 h-3 mr-1" />
                {kpis.totalPolicies} policies
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalClaims}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />
                All time
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.activePolicies}</div>
              <div className="flex items-center text-xs text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                Currently active
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.approvalRate.toFixed(1)}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <FileText className="w-3 h-3 mr-1" />
                Claims approved
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros de período */}
        <Card>
          <CardHeader>
            <CardTitle>{t("common.reportSettings")}</CardTitle>
            <CardDescription>Customize your report visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select defaultValue="2024">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t("common.year")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="todos">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">All Products</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de sinistros por mês */}
          <Card>
            <CardHeader>
              <CardTitle>Claims by Month</CardTitle>
              <CardDescription>Monthly claims evolution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={claimsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#3b82f6" name="Quantity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de sinistros por tipo */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution by Type</CardTitle>
              <CardDescription>Most frequent claim types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={claimsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, percentual }) => `${tipo} ${percentual}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {claimsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de área - Receita */}
        <Card>
          <CardHeader>
            <CardTitle>Sum Insured Evolution</CardTitle>
            <CardDescription>Monthly sum insured amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={policiesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Sum Insured"]} />
                <Area type="monotone" dataKey="premios" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico comparativo */}
        <Card>
          <CardHeader>
            <CardTitle>Approved vs Rejected Claims</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="aprovados" fill="#10b981" name="Approved" />
                <Bar dataKey="rejeitados" fill="#ef4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabelas de dados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
              <CardDescription>Latest claims in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cause</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.slice(0, 5).map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.claim_number}</TableCell>
                      <TableCell>
                        <Badge variant={claim.status === "Paid" ? "default" : "secondary"}>{claim.status}</Badge>
                      </TableCell>
                      <TableCell>{claim.cause_of_loss || "N/A"}</TableCell>
                      <TableCell>{new Date(claim.created_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Policies</CardTitle>
              <CardDescription>Latest policies created</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Named Insured</TableHead>
                    <TableHead>Sum Insured</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.slice(0, 5).map((policy) => {
                    const now = new Date()
                    const start = new Date(policy.period_start)
                    const end = new Date(policy.period_end)
                    const isActive = now >= start && now <= end

                    return (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.policy_number}</TableCell>
                        <TableCell>{policy.named_insured}</TableCell>
                        <TableCell>{formatCurrency(policy.sum_insured)}</TableCell>
                        <TableCell>
                          <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Policy, CreatePolicyData, UpdatePolicyData, Exclusion } from "../types/policy"

function createClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function getPolicies(): Promise<Policy[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      exclusions:policy_exclusions(
        exclusion:exclusions(*)
      )
    `)
    .order("created_date", { ascending: false })

  if (error) {
    console.error("Error fetching policies:", error)
    throw new Error("Failed to fetch policies")
  }

  return (
    data?.map((policy) => ({
      ...policy,
      exclusions: policy.exclusions?.map((pe: any) => pe.exclusion) || [],
    })) || []
  )
}

export async function getPolicyById(id: number): Promise<Policy | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      exclusions:policy_exclusions(
        exclusion:exclusions(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching policy:", error)
    return null
  }

  return data
    ? {
        ...data,
        exclusions: data.exclusions?.map((pe: any) => pe.exclusion) || [],
      }
    : null
}

export async function createPolicy(policyData: CreatePolicyData): Promise<Policy> {
  const supabase = createClient()

  const { data, error } = await supabase.from("policies").insert([policyData]).select().single()

  if (error) {
    console.error("Error creating policy:", error)
    throw new Error("Failed to create policy")
  }

  return data
}

export async function updatePolicy(id: number, policyData: UpdatePolicyData): Promise<Policy> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("policies")
    .update({ ...policyData, modified_date: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating policy:", error)
    throw new Error("Failed to update policy")
  }

  return data
}

export async function deletePolicy(id: number): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("policies").delete().eq("id", id)

  if (error) {
    console.error("Error deleting policy:", error)
    throw new Error("Failed to delete policy")
  }
}

export async function getExclusions(): Promise<Exclusion[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("exclusions").select("*").order("title")

  if (error) {
    console.error("Error fetching exclusions:", error)
    throw new Error("Failed to fetch exclusions")
  }

  return data || []
}

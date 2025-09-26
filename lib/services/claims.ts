import { createClient } from "@/lib/supabase/server"
import type { Claim } from "@/lib/types/activity"

export async function getClaims(): Promise<Claim[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("claims").select("*").order("logged_date", { ascending: false })

  if (error) {
    console.error("Error fetching claims:", error)
    throw new Error("Failed to fetch claims")
  }

  return data || []
}

export async function getClaimById(id: number): Promise<Claim | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("claims").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching claim:", error)
    return null
  }

  return data
}

export async function getClaimByNumber(claimNumber: string): Promise<Claim | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("claims").select("*").eq("claim_number", claimNumber).single()

  if (error) {
    console.error("Error fetching claim by number:", error)
    return null
  }

  return data
}

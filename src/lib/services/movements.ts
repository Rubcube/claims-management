import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Movement, CreateMovementData } from "../types/movement"

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

export async function getMovements(): Promise<Movement[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("movements")
    .select(`
      *,
      claim:claims(*)
    `)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching movements:", error)
    throw new Error("Failed to fetch movements")
  }

  return data || []
}

export async function getMovementsByClaimId(claimId: number): Promise<Movement[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("movements")
    .select(`
      *,
      claim:claims(*)
    `)
    .eq("claim_id", claimId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching movements for claim:", error)
    throw new Error("Failed to fetch movements for claim")
  }

  return data || []
}

export async function getMovementById(id: number): Promise<Movement | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("movements")
    .select(`
      *,
      claim:claims(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching movement:", error)
    return null
  }

  return data
}

export async function createMovement(movementData: CreateMovementData): Promise<Movement> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("movements")
    .insert([movementData])
    .select(`
      *,
      claim:claims(*)
    `)
    .single()

  if (error) {
    console.error("Error creating movement:", error)
    throw new Error("Failed to create movement")
  }

  return data
}

export async function deleteMovement(id: number): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("movements").delete().eq("id", id)

  if (error) {
    console.error("Error deleting movement:", error)
    throw new Error("Failed to delete movement")
  }
}

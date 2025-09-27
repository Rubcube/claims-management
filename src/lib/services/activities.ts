import { createClient } from "@/lib/supabase/server"
import type { Activity, CreateActivityData, UpdateActivityData } from "@/lib/types/activity"

export async function getActivities(): Promise<Activity[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activities")
    .select(`
      *,
      claim:claims(*)
    `)
    .order("created_date", { ascending: false })

  if (error) {
    console.error("Error fetching activities:", error)
    throw new Error("Failed to fetch activities")
  }

  return data || []
}

export async function getActivityById(id: number): Promise<Activity | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activities")
    .select(`
      *,
      claim:claims(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching activity:", error)
    return null
  }

  return data
}

export async function getActivitiesByClaimId(claimId: number): Promise<Activity[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activities")
    .select(`
      *,
      claim:claims(*)
    `)
    .eq("claim_id", claimId)
    .order("created_date", { ascending: false })

  if (error) {
    console.error("Error fetching activities by claim ID:", error)
    throw new Error("Failed to fetch activities")
  }

  return data || []
}

export async function createActivity(activityData: CreateActivityData): Promise<Activity> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activities")
    .insert({
      ...activityData,
      created_date: new Date().toISOString(),
      status: activityData.status || "InProgress", // Default to InProgress
    })
    .select(`
      *,
      claim:claims(*)
    `)
    .single()

  if (error) {
    console.error("Error creating activity:", error)
    throw new Error("Failed to create activity")
  }

  return data
}

export async function updateActivity(id: number, activityData: UpdateActivityData): Promise<Activity> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activities")
    .update({
      ...activityData,
      modified_date: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`
      *,
      claim:claims(*)
    `)
    .single()

  if (error) {
    console.error("Error updating activity:", error)
    throw new Error("Failed to update activity")
  }

  return data
}

export async function deleteActivity(id: number): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("activities").delete().eq("id", id)

  if (error) {
    console.error("Error deleting activity:", error)
    throw new Error("Failed to delete activity")
  }
}

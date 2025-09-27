"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/app/components/auth/auth-provider"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  department: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("users").select("*").eq("id", user?.id).single()

      if (error) throw error

      setProfile(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return false

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      await fetchProfile()
      return true
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
      return false
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  }
}

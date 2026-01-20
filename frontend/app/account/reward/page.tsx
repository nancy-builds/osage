"use client"

import Link from "next/link"
import { SectionHeader } from "@/components/account/section-header"
import { ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


type Profile = {
  name: string
  phone: string
  avatar: string
  membership_level: string
  loyalty_points: number
  createdAt: string
}

interface Reward {
  id: string
  name: string
  description: string
  required_points: number
  expires_at: string | null
  is_active: boolean
  image_url: string
}

export default function RewardsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, rewardsRes] = await Promise.all([
          fetch("http://localhost:5000/api/auth/profile", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/reward", {
            credentials: "include",
          }),
        ])

        if (!profileRes.ok) throw new Error("Failed to load profile")
        if (!rewardsRes.ok) throw new Error("Failed to load rewards")

        const profileData = await profileRes.json()
        const rewardsData = await rewardsRes.json()

        setProfile(profileData)
        setRewards(rewardsData)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /* ---------- UI STATES ---------- */

  
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-muted-foreground">
        Loading rewards...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-destructive">
        {error}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-muted-foreground">
        Profile not found
      </div>
    )
  }

  const progressPercent = Math.min(
    (profile.loyalty_points / 500) * 100,
    100
  )

  const handleRedeem = async (rewardId: string) => {
  const res = await fetch(
    `http://localhost:5000/api/reward/${rewardId}/redeem`,
    {
      method: "POST",
      credentials: "include",
    }
  )

  const data = await res.json()

  if (!res.ok) {
    alert(data.error)
    return
  }

  alert("🎉 Reward redeemed successfully!")
}



  return (
    <main className="min-h-screen bg-background">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Link href="/account" className="text-accent hover:opacity-80">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Redeem Rewards</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Loyalty Points</h2>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Your Points</p>
              <p className="text-3xl font-bold text-primary">
                {profile.loyalty_points}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground pb-1">Membership</p>
              <Badge variant="default">
                {profile.membership_level}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Membership Progress</span>
              <span>500 pts</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${progressPercent}%` 
                }}
              />
            </div>
          </div>
        </div>


        <div className="bg-card border border-border rounded-lg">
          <SectionHeader title="Redeem Rewards" subtitle="Exchange points for rewards" />
          <div className="space-y-3 p-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="relative overflow-hidden rounded-xl border border-border"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-no-repeat bg-right bg-[length:50%]"
                  style={{
                    backgroundImage: `url(${reward.image_url})`,
                  }}

                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="relative flex items-center justify-between p-6 text-white">
                  {/* Left content */}
                  <div className="max-w-[65%] space-y-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary">
                      Reward
                    </span>

                    <h3 className="text-lg font-bold leading-tight">
                      {reward.name}
                    </h3>

                    <p className="text-sm opacity-90 w-4/5">
                      {reward.description}
                    </p>

                    <p className="text-xs opacity-80">
                      Requires {reward.required_points} points
                    </p>

                    {reward.expires_at && (
                      <p className="text-xs opacity-70">
                        Expires on{" "}
                        {new Date(reward.expires_at).toLocaleDateString()}
                      </p>
                    )}

                  {/* CTA */}
                  <div>
                  <Button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={
                      profile.loyalty_points < reward.required_points ||
                      (reward.expires_at && new Date(reward.expires_at) < new Date())
                    }
                    className="w-full mt-6 py-5"

                  >
                    Redeem
                  </Button>

                  {/* Error message */}
                  {reward.expires_at && new Date(reward.expires_at) < new Date() ? (
                    <p className="text-xs text-amber-500 mt-1">
                      This reward has expired
                    </p>
                  ) : profile.loyalty_points < reward.required_points ? (
                    <p className="text-xs text-amber-500 mt-1">
                      You don’t have enough loyalty points
                    </p>

                  ) : null}
                    </div>
                  </div>
                </div>
              </div>

            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <SectionHeader title="Earned Rewards" subtitle="You earned these rewards previously" />
          <div className="space-y-3 p-6">

            {profile.rewards?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You haven’t redeemed any rewards yet.
              </p>
            )}

            {profile.rewards?.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {reward.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Redeemed for {reward.required_points} points
                  </p>

                  {reward.expires_at && (
                    <p className="text-xs text-muted-foreground">
                      Expires on{" "}
                      {new Date(reward.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <Badge variant="default">
                  Redeemed
                </Badge>
              </div>
            ))}
    

          </div>
        </div>
      </div>

      
    </main>
  )
}

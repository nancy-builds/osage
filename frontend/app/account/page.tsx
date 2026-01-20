"use client"

import { ProfileHeader, MenuItem } from "@/components/account/profile-header"
import { User, Settings, History , CreditCard, MessageSquare,Star, Gift, LogOut } from "lucide-react"
import { useEffect, useState } from "react"

type Profile = {
  name: string
  phone: string
  avatar: string
  status: string
  loyaltyPoints: number
  createdAt: string
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)

useEffect(() => {
  fetch("http://localhost:5000/api/auth/profile", {
    credentials: "include",
  })
    .then(async res => {
      if (!res.ok) {
        throw new Error(`Unauthorized (${res.status})`)
      }
      return res.json()
    })
    .then(data => setProfile(data))
    .catch(err => {
      console.error(err)
      setProfile(null)
    })
}, [])


if (!profile) {
  return( 
        <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Account</h1>
      </div>

      <div className="p-3 space-y-6">
        <p>Please log in to view your profile.</p>
      </div>
    </div>
  )
}


return (
    <main className="min-h-screen bg-background">
      <ProfileHeader
        full_name={profile.full_name}
        phone={profile.phone}
        avatar_url={profile.avatar_url}
        membership_level={profile.membership_level}
        loyalty_points={profile.loyalty_points}
        created_at={new Date(profile.created_at).toLocaleDateString()}
      />

      <div className=" mx-auto">
        <div className="bg-card border border-border rounded-lg m-6">
          <MenuItem icon={<User size={20} />} label="Profile Information" href="/account/profile-info" />
          <MenuItem icon={<Settings size={20} />} label="Settings" href="/account/settings" />
        </div>

        <div className="bg-card border border-border rounded-lg m-6">
          <MenuItem icon={<History  size={20} />} label="Order History" href="/account/my-orders" />
          <MenuItem icon={<MessageSquare size={20} />} label="Feedback & Reviews" href="/account/feedback" />
          <MenuItem icon={<Gift size={20} />} label="Redeem Rewards" href="/account/reward" />
        </div>

        <div className="bg-card border border-border rounded-lg m-6">
          <MenuItem icon={<LogOut size={20} />} label="Log Out" href="/login" variant="destructive" />
        </div>
      </div>
    </main>
  )
}

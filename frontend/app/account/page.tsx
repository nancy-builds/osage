"use client"

import { ProfileHeader, MenuItem } from "../../components/account/profile-header"
import { User, Settings, History, Loader2 , ClipboardList, Gift, LogOut, Image } from "lucide-react"
import { useEffect, useState } from "react"
import { formatTime } from '../../hooks/format-time'
import { apiFetch } from "../../lib/api"
import ContentState from "../../components/layout/ContentState"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/constants/api"

type Profile = {
  full_name: string
  phone: string
  avatar_url: string
  membership_level: string
  loyalty_points: number
  created_at: string
  role: string
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
const handleLogout = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setProfile(null);      // ✅ clear user state immediately
    router.push("/login"); // ✅ redirect
  } catch (err) {
    console.error("Logout failed", err);
  }
};

  useEffect(() => {
    let mounted = true

    const loadProfile = async () => {
      try {
        mounted && setIsLoading(true) // ✅ start loading

        const res = await apiFetch("/auth/profile")

        if (res.status === 401) {
          mounted && setProfile(null)
          return
        }

        if (!res.ok) {
          throw new Error(`Failed to load profile (${res.status})`)
        }

        const data = await res.json()
        mounted && setProfile(data)
      } catch (err) {
        console.error(err)
        mounted && setProfile(null)
      } finally {
        mounted && setIsLoading(false) // ✅ always stop loading
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [])

if (!profile) {
  return( 
    <div>
    <div className="bg-background border-b border-border">
      <div className="px-6 py-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-gray-300 ring-offset-2 ring-offset-background">
            <AvatarFallback className="h-full w-full flex items-center justify-center bg-muted">
              <Image className="h-10 w-10 text-muted-foreground opacity-50" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
      <ContentState isLoading/>
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
          created_at={formatTime(profile.created_at)}

          role={profile.role}
        />
        <div className="mx-auto">
          {/* Common section */}
          <div className="bg-card border border-border rounded-lg m-6">
            <MenuItem
              icon={<User size={20} />}
              label="Profile Information"
              href="/account/profile-info"
            />
            <MenuItem
              icon={<Settings size={20} />}
              label="Settings"
              href="/account/settings"
            />
          </div>

          {/* Role-based section */}
          {profile.role === "restaurant" ? (
            <div className="bg-card border border-border rounded-lg m-6">
              <MenuItem
                icon={<ClipboardList size={20} />}
                label="Order Management"
                href="/restaurant/orders"
              />
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg m-6">
              <MenuItem
                icon={<History size={20} />}
                label="Order History"
                href="/account/my-orders"
              />
              <MenuItem
                icon={<Gift size={20} />}
                label="Redeem Rewards"
                href="/account/reward"
              />
            </div>
          )}

          {/* Logout */}
          <div className="bg-card border border-border rounded-lg m-6">
            <MenuItem
  icon={<LogOut size={20} />}
  label="Log Out"
  variant="destructive"
  onClick={handleLogout}
/>
          </div>
        </div>
        
    </main>
  )
}

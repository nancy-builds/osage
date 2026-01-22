"use client"

import type React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { badgeVariants, Badge } from "@/components/ui/badge"
import { formatTime } from '@/hooks/format-time'


export interface ProfileHeaderProps {
  full_name: string
  avatar_url?: string
  phone?: string
  membership_level?:  "basic" | "silver" | "gold" | "vip" 
  loyalty_points?: number
  created_at?: string
  role?: string
}


export function ProfileHeader({ full_name, phone, avatar_url, membership_level, loyalty_points, created_at, role }: ProfileHeaderProps) {
  const initials =
    full_name
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?"

  return (
    <div className="bg-background border-b border-border">
      <div className="px-6 py-8">
        <div className="flex items-start gap-6 ">
          <Avatar className="h-24 w-24 ring-2 ring-gray-300 ring-offset-2 ring-offset-background">
            <AvatarImage 
              src={avatar_url || "/profile/chopstick.png"} 
              alt={full_name} 
              className="h-24 w-24 object-contain mx-auto my-auto" />
            <AvatarFallback className="text-accent-foreground text-3xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Name */}
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {full_name}
            </h1>

            {/* Phone */}
            <div className="text-xs mt-3 tracking-wide text-muted-foreground">
              <p>Phone: {phone}</p>
              <p>Member since: {formatTime(created_at)}</p>
            </div>
            
            {/* Meta info */}
            <div className="mt- flex flex-wrap items-center gap-x-10 pt-3">
              {/* CUSTOMER META */}
              {role !== "restaurant" && (
                <>
                  {membership_level && (
                      <Badge>{membership_level}</Badge>
                  )}

                  {loyalty_points !== undefined && (
                  <div className="flex items-center gap-1">
                    <p className="text-xs tracking-wide text-muted-foreground">
                      Loyalty Points:
                    </p>
                    <p className="text-xs font-semibold text-primary">
                      {loyalty_points}
                    </p>
                  </div>

                  )}
                </>
              )}

              {/* RESTAURANT META */}
              {role === "restaurant" && (
                <>
                  <div>
                    <p className="text-xs tracking-wide text-muted-foreground">
                      Role
                    </p>
                    <p className="text-xs font-medium text-primary">
                      Restaurant
                    </p>
                  </div>

                  <div>
                    <Badge>Active</Badge>
                  </div>
                </>
              )}
            </div>




          </div>
        </div>
      </div>
    </div>
    )
  }

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  href: string
  onClick?: () => void
  variant?: "default" | "destructive"
}

export function MenuItem({ icon, label, href, onClick, variant = "default" }: MenuItemProps) {
  const textColor = variant === "destructive" ? "text-destructive" : "text-foreground"

  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0 ${textColor}`}
    >
      <div className="flex items-center gap-3">
        <div className={`${variant === "destructive" ? "text-destructive" : "text-accent"}`}>{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-muted-foreground">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

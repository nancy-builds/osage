"use client"

import type React from "react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { badgeVariants, Badge } from "@/components/ui/badge"
export interface ProfileHeaderProps {
  full_name: string
  phone: string
  avatar_url: string | null
  membership_level: "basic" | "silver" | "gold" | "vip"
  loyalty_points: number
  created_at: string
  role: string
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
            <AvatarFallback className="bg-primary text-accent-foreground text-3xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

      <div className="flex-1 min-w-0">
        {/* Name */}
        <h1 className="text-xl font-semibold text-foreground leading-tight">
          {full_name}
        </h1>

        {/* Phone */}
        <p className="text-sm text-muted-foreground mt-1">
          {phone}
        </p>
        <p className="text-xs tracking-wide text-muted-foreground">
          Member since: {created_at}
        </p>

        {/* Meta info */}
        <div className="mt-4 flex flex-wrap items-center gap-x-15 gap-y-3">
          {/* Status */}
          <div>
            <p className="text-xs tracking-wide text-muted-foreground">
              Status
            </p>
            <Badge>
              {membership_level}
            </Badge>
          </div>

          {/* Loyalty points */}
          <div>
            <p className="text-xs tracking-wide text-muted-foreground">
              Loyalty Points
            </p>
            <p className="text-sm font-semibold text-primary">
              {loyalty_points}
            </p>

          </div>
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

"use client"

import Image from "next/image"

interface PartnershipLogosProps {
  collapsed: boolean
}

export function PartnershipLogos({ collapsed }: PartnershipLogosProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        {/* C. Lewis Logo */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <Image src="/logos/c-lewis-logo.jpeg" alt="C. Lewis" fill className="object-contain p-1" />
        </div>

        {/* Partnership Indicator */}
        <div className="w-6 h-px bg-gradient-to-r from-transparent via-sidebar-accent to-transparent" />

        {/* Lime Syndicate Logo */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <Image src="/logos/lime-logo.svg" alt="Lime Syndicate Management" fill className="object-contain p-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between w-full">
      {/* C. Lewis Section */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <Image src="/logos/c-lewis-logo.jpeg" alt="C. Lewis" fill className="object-contain p-1.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">C. Lewis</span>
          <span className="text-xs text-sidebar-foreground/70">Insurance</span>
        </div>
      </div>

      {/* Partnership Divider */}
      <div className="flex flex-col items-center mx-4">
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-sidebar-accent to-transparent" />
        <div className="text-xs text-sidebar-foreground/50 font-medium mt-1">+</div>
      </div>

      {/* Lime Syndicate Section */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold text-sidebar-foreground">Lime Syndicate</span>
          <span className="text-xs text-sidebar-foreground/70">Management</span>
        </div>
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <Image src="/logos/lime-logo.svg" alt="Lime Syndicate Management" fill className="object-contain p-1.5" />
        </div>
      </div>
    </div>
  )
}

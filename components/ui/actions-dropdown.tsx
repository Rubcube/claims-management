"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Activity, Trash2 } from "lucide-react"
import Link from "next/link"

interface ActionsDropdownProps {
  viewHref?: string
  editHref?: string
  activitiesHref?: string
  onDelete?: () => void
  showActivities?: boolean
}

export function ActionsDropdown({
  viewHref,
  editHref,
  activitiesHref,
  onDelete,
  showActivities = false,
}: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewHref && (
          <DropdownMenuItem asChild>
            <Link href={viewHref}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
        )}
        {editHref && (
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}
        {showActivities && activitiesHref && (
          <DropdownMenuItem asChild>
            <Link href={activitiesHref}>
              <Activity className="mr-2 h-4 w-4" />
              Activities
            </Link>
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

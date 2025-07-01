"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Store } from "lucide-react"

export function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session?.user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => router.push("/auth/signin")}>
          Sign in
        </Button>
        <Button onClick={() => router.push("/auth/signup")}>Join now</Button>
      </div>
    )
  }

  const handleSignOut = async () => {
    console.log("🚪 Signing out...")
    await signOut({ callbackUrl: "/" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name} />
            <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">{session.user.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {session.user.role === "vendor" && (
          <DropdownMenuItem onClick={() => router.push("/vendor-dashboard")}>
            <Store className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

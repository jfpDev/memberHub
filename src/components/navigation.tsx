"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, UserPlus, Search } from "lucide-react"

const navItems = [
  { href: "/", label: "Principal", icon: Users },
  { href: "/registro", label: "Registro", icon: UserPlus },
  { href: "/busqueda", label: "Búsqueda", icon: Search },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card h-26 lg:h-20">
      <div className="max-w-4xl px-4 m-auto">
        <div className="flex flex-col lg:flex-row h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 mt-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Construyendo Ideas</span>
          </Link>

          <div className="flex items-center gap-1 mt-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

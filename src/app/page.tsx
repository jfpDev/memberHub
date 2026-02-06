"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllMembers, type Member } from "@/lib/firebase"
import { Users, UserPlus, Search } from "lucide-react"

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const allMembers = await getAllMembers()
        setMembers(allMembers)
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const stats = {
    total: members.length,
    // voters: members.filter((m) => m.membershipType === "voter").length,
    // leaders: members.filter((m) => m.membershipType === "leader").length,
    // visualizers: members.filter((m) => m.membershipType === "visualizer").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Panel principal</h1>
          <p className="mt-2 text-muted-foreground">
            Sistema de registro y verificación de miembros.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 grid-cols-1 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : stats.total}
              </div>
              <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total líderes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : stats.leaders}
              </div>
              <p className="text-xs text-muted-foreground">Líder de votantes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total votantes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : stats.voters}
              </div>
              <p className="text-xs text-muted-foreground">Votantes no líderes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total testigos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : stats.visualizers}
              </div>
              <p className="text-xs text-muted-foreground">Personas testigos</p>
            </CardContent>
          </Card> */}
        </div>

        {/* Quick Actions */}
        <div className="mx-auto grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Registrar nuevo miembro
              </CardTitle>
              <CardDescription>
                Agregar un nuevo miembro al sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/registro">
                <Button className="w-full">Registrar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar miembros
              </CardTitle>
              <CardDescription>
                Buscar por nombre, correo o teléfono para encontrar un miembro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/busqueda">
                <Button variant="outline" className="w-full bg-transparent">
                  Buscar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

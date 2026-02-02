"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { searchMembersMultiField, getAllMembers, type Member } from "@/lib/firebase"
import { Search, Loader2, User, Mail, Phone, ArrowRight, Users } from "lucide-react"
import { Timestamp } from "firebase/firestore"

function formatDate(date: Date | Timestamp | undefined): string {
  if (!date) return "N/A"
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString()
  }
  return new Date(date).toLocaleDateString()
}

function getMembershipColor(type: string) {
  switch (type) {
    case "premium":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "student":
      return "bg-sky-100 text-sky-800 border-sky-200"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export function MemberSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  // Load all members on initial mount
  useEffect(() => {
    async function loadMembers() {
      try {
        const allMembers = await getAllMembers()
        setMembers(allMembers)
      } catch (error) {
        console.error("Failed to load members:", error)
      } finally {
        setInitialLoad(false)
      }
    }
    loadMembers()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      const allMembers = await getAllMembers()
      setMembers(allMembers)
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    try {
      const results = await searchMembersMultiField(searchTerm)
      setMembers(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = async () => {
    setSearchTerm("")
    setHasSearched(false)
    setIsLoading(true)
    try {
      const allMembers = await getAllMembers()
      setMembers(allMembers)
    } catch (error) {
      console.error("Failed to load members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, correo o teléfono..."
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
            </Button>
            {hasSearched && (
              <Button type="button" variant="outline" onClick={handleClear}>
                Limpiar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {hasSearched ? "Search Results" : "Todos los miembros"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {members.length} {members.length === 1 ? "member" : "members"} found
          </span>
        </div>

        {initialLoad ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">Ningún miembro encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasSearched
                  ? "Intenta ajustar tus criterios de búsqueda e inténtalo de nuevo."
                  : "Registra tu primer miembro en el sistema."}
              </p>
              {!hasSearched && (
                <Link href="/registro">
                  <Button className="mt-4">Registrar Miembro</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {members.map((member) => (
              <Link key={member.id} href={`/member/${member.id}`}>
                <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {member.firstName} {member.lastName}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={getMembershipColor(member.membershipType)}
                        >
                          {member.membershipType}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Enrolled: {formatDate(member.enrollmentDate)}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

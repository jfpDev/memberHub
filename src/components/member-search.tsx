"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Member, filterMembersByCriteria, type MemberFilters, searchMembers } from "@/lib/firebase"
import { Search, Loader2, User, Mail, Phone, ArrowRight, Users, X } from "lucide-react"
import { Timestamp } from "firebase/firestore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

function formatDate(date: Date | Timestamp | undefined): string {
  if (!date) return "N/A"
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString()
  }
  return new Date(date).toLocaleDateString()
}

function getMembershipColor(type: string) {
  switch (type) {
    case "leader":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "voter":
      return "bg-sky-100 text-sky-800 border-sky-200"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export function MemberSearch() {
  const [filters, setFilters] = useState<MemberFilters>({
    personId: "",
    votingPlace: "",
    table: "",
    // memberType: "",
    // leader: "",
    // phone: "",
  })
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleFilterChange = (field: keyof MemberFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if at least one filter is provided
    const hasFilters = Object.values(filters).some((value) => value && value.trim() !== "")
    
    if (!hasFilters) {
      alert("Por favor, ingresa al menos un criterio de búsqueda")
      return
    }

    setIsLoading(true)
    try {
      // Build the filter object with only non-empty values
      // const activeFilters: MemberFilters = {}
      let results: Member[] = [];
      if (filters.personId?.trim()) results = await searchMembers('personId', filters.personId)
      if (filters.votingPlace?.trim()) results = await searchMembers('votingPlace', filters.votingPlace)
      if (filters.table) results = await searchMembers('table', filters.table)
      // if (filters.leader?.trim()) activeFilters.leader = filters.leader
      // if (filters.phone?.trim()) activeFilters.phone = filters.phone

      // const results = await searchMembers('personId', filters.personId)
      setMembers(results)
      setHasSearched(true)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setFilters({
      personId: "",
      // memberType: "",
      // leader: "",
      votingPlace: "",
      table: "",
      // phone: "",
    })
    setMembers([])
    setHasSearched(false)
  }

  const isAnyFilterActive = Object.values(filters).some((value) => value && value.trim() !== "")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar miembros
          </CardTitle>
          <CardDescription>
            Filtra por cédula, tipo de miembro, líder, teléfono o lugar de votación. Completa uno o más campos para buscar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Cédula / PersonId Filter */}
              <div className="space-y-2">
                <Label htmlFor="personId">Cédula</Label>
                <Input
                  id="personId"
                  type="text"
                  placeholder="Ej: 1234567890"
                  value={filters.personId || ""}
                  onChange={(e) => handleFilterChange("personId", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Membership Type Filter */}
              {/* <div className="space-y-2">
                <Label htmlFor="membershipType">Tipo de Miembro</Label>
                <Select
                  value={filters.memberType || "all"}
                  onValueChange={(value) => handleFilterChange("memberType", value === "all" ? "" : value)}
                >
                  <SelectTrigger id="membershipType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="voter">Votante</SelectItem>
                    <SelectItem value="leader">Líder</SelectItem>
                    <SelectItem value="visualizer">Testigo</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              {/* Leader Filter */}
              {/* <div className="space-y-2">
                <Label htmlFor="leader">Líder</Label>
                <Input
                  id="leader"
                  type="text"
                  placeholder="Nombre del líder"
                  value={filters.leader || ""}
                  onChange={(e) => handleFilterChange("leader", e.target.value)}
                  className="w-full"
                />
              </div> */}

              {/* Phone Filter */}
              {/* <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej: 3001234567"
                  value={filters.phone || ""}
                  onChange={(e) => handleFilterChange("phone", e.target.value)}
                  className="w-full"
                />
              </div> */}

              {/* Voting Place Filter */}
              <div className="space-y-2">
                <Label htmlFor="votingPlace">Lugar de Votación</Label>
                <Input
                  id="votingPlace"
                  type="text"
                  placeholder="Ej: Escuela Central"
                  value={filters.votingPlace || ""}
                  onChange={(e) => handleFilterChange("votingPlace", e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* Voting Table Filter */}
              <div className="space-y-2">
                <Label htmlFor="table">Mesa de Votación</Label>
                <Input
                  id="table"
                  type="number"
                  placeholder="Ej: 12"
                  value={filters.table || ""}
                  onChange={(e) => handleFilterChange("table", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Buscar
              </Button>
              {isAnyFilterActive && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClear}
                  className="flex-1 md:flex-none"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {hasSearched ? "Resultados de búsqueda" : "Todos los miembros"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {members.length} {members.length === 1 ? "miembro" : "miembros"} encontrado
          </span>
        </div>

        {members.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">
                {hasSearched ? "No se encontraron miembros" : "Haz una búsqueda para visualizar aquí"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasSearched
                  ? "Intenta ajustar tus criterios de búsqueda e inténtalo de nuevo."
                  : "Registra un nuevo miembro en el sistema."}
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
                            {member.personId}
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
                          className={getMembershipColor(member.memberType)}
                        >
                          {member.memberType}
                        </Badge>
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

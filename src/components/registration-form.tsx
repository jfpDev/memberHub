"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { addMember } from "@/lib/firebase"
import { Loader2, CheckCircle } from "lucide-react"

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    leader: "",
    firstName: "",
    lastName: "",
    personId: "",
    phone: "",
    address: "",
    votingPlace: "",
    table: 0,
    memberType: "voter" as "voter" | "leader" | "visualizer",
    notes: "",
  })

  const handleChange = (field: string, value: string) => {
    if (field === "leader" && value.trim() === "") {
      value = null as unknown as string
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await addMember({...formData})
      setIsSuccess(true)
      setTimeout(() => {
        setFormData({
          leader: "",
          firstName: "",
          lastName: "",
          personId: "",
          phone: "",
          address: "",
          votingPlace: "",
          table: 0,
          memberType: "voter" as "voter" | "leader" | "visualizer",
          notes: "",
        })
        setIsSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register member")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CheckCircle className="h-16 w-16 text-accent" />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Registro exitoso!</h2>
          <p className="mt-2 text-muted-foreground">Continúa ingresando personas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Registro de nuevo miembro</CardTitle>
        <CardDescription>
          Llena el registro con los detalles del nuevo miembro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombres</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="personId">Cédula</Label>
              <Input
                id="personId"
                type="text"
                value={formData.personId}
                onChange={(e) => handleChange("personId", e.target.value)}
                placeholder="1110123456"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 w-full">
              <Label htmlFor="membershipType">Tipo de miembro</Label>
              <Select
                value={formData.memberType}
                onValueChange={(value) => handleChange("membershipType", value)}
              >
                <SelectTrigger id="membershipType">
                  <SelectValue placeholder="Select membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Líder</SelectItem>
                  <SelectItem value="visualizer">Testigo</SelectItem>
                  <SelectItem value="voter">Votante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leader">Líder</Label>
              <Input
                id="leader"
                value={formData.leader}
                onChange={(e) => handleChange("leader", e.target.value)}
                placeholder="Nombre del líder"
                disabled={formData.memberType === "leader"}
              />
            </div>
            
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="votingPlace">Lugar de votación</Label>
              <Input
                id="votingPlace"
                value={formData.votingPlace}
                onChange={(e) => handleChange("votingPlace", e.target.value)}
                placeholder="La Nueva Jerusalem"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table">Mesa</Label>
              <Input
                id="table"
                type="number"
                value={formData.table}
                onChange={(e) => handleChange("table", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Nota (Opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Alguna nota adicional..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Member"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

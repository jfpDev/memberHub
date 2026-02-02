"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    membershipType: "standard" as "standard" | "premium" | "student",
    enrollmentDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await addMember({
        ...formData,
        enrollmentDate: new Date(formData.enrollmentDate),
      })
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/search")
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
          <p className="mt-2 text-muted-foreground">Redirigiendo a la búsqueda...</p>
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
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@example.com"
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

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="New York"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="membershipType">Tipo de miembro</Label>
              <Select
                value={formData.membershipType}
                onValueChange={(value) => handleChange("membershipType", value)}
              >
                <SelectTrigger id="membershipType">
                  <SelectValue placeholder="Select membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Estandar</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Fecha de ingreso</Label>
              <Input
                id="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleChange("enrollmentDate", e.target.value)}
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

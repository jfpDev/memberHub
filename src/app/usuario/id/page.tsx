"use client"

import React from "react"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMemberById, type Member } from "@/lib/firebase"
import { Timestamp } from "firebase/firestore"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Loader2,
} from "lucide-react"

function formatDate(date: Date | Timestamp | undefined): string {
  if (!date) return "N/A"
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
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

function getMembershipLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1) + " Membership"
}

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: string
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

// export function generateStaticParams() {
//   return {
//     id: '123',
//     firstName: 'fulano',
//     lastName: 'de tal',
//     email: 'example@mail.com',
//     phone: '123456789',
//     address: 'Main house',
//     city: 'Metropolis',
//     membershipType: "standard",
//     enrollmentDate: new Date(),
//     notes: 'Some notes here',
//     createdAt: new Date()
//   }
// }

export default function MemberDetailPage() {
  // const { id } = use(params)
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // async function loadMember() {
    //   try {
    //     const memberData = await getMemberById(id)
    //     if (memberData) {
    //       setMember(memberData)
    //     } else {
    //       setError("Member not found")
    //     }
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : "Failed to load member")
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
    // loadMember()
    setMember({
      id: '123',
      firstName: 'fulano',
      lastName: 'de tal',
      email: 'example@mail.com',
      phone: '123456789',
      address: 'Main house',
      city: 'Metropolis',
      membershipType: "standard",
      enrollmentDate: new Date(),
      notes: 'Some notes here',
      createdAt: new Date()
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/search">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <h2 className="text-xl font-semibold text-foreground">Error</h2>
              <p className="mt-2 text-muted-foreground">{error}</p>
              <Link href="/search">
                <Button className="mt-4">Return to Search</Button>
              </Link>
            </CardContent>
          </Card>
        ) : member ? (
          <div className="space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div className="mt-4 sm:ml-6 sm:mt-0">
                    <h1 className="text-2xl font-bold text-foreground">
                      {member.firstName} {member.lastName}
                    </h1>
                    <p className="mt-1 text-muted-foreground">{member.email}</p>
                    <div className="mt-3">
                      <Badge
                        variant="outline"
                        className={getMembershipColor(member.membershipType)}
                      >
                        {getMembershipLabel(member.membershipType)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                  <CardDescription>Member contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <DetailRow
                    icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                    label="Email Address"
                    value={member.email}
                  />
                  <DetailRow
                    icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                    label="Phone Number"
                    value={member.phone}
                  />
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Address</CardTitle>
                  <CardDescription>Member location details</CardDescription>
                </CardHeader>
                <CardContent>
                  <DetailRow
                    icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                    label="Full Address"
                    value={`${member.address}, ${member.city}`}
                  />
                </CardContent>
              </Card>

              {/* Membership Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Membership Details</CardTitle>
                  <CardDescription>Enrollment and membership info</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <DetailRow
                    icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                    label="Membership Type"
                    value={getMembershipLabel(member.membershipType)}
                  />
                  <DetailRow
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    label="Enrollment Date"
                    value={formatDate(member.enrollmentDate)}
                  />
                  <DetailRow
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    label="Registration Date"
                    value={formatDate(member.createdAt)}
                  />
                </CardContent>
              </Card>

              {/* Notes */}
              {member.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                    <CardDescription>Additional information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DetailRow
                      icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                      label="Notes"
                      value={member.notes}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}

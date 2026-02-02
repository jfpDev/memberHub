import { Navigation } from "@/components/navigation"
import { MemberSearch } from "@/components/member-search"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <MemberSearch />
      </main>
    </div>
  )
}

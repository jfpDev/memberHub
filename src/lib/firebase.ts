import { initializeApp, getApps } from "firebase/app"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

// Collection reference
const MEMBERS_COLLECTION = "members"

// Types
export interface Member {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  membershipType: "standard" | "premium" | "student"
  enrollmentDate: Date | Timestamp
  notes?: string
  createdAt: Date | Timestamp
}

// Add a new member
export async function addMember(member: Omit<Member, "id" | "createdAt">) {
  const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), {
    ...member,
    enrollmentDate: Timestamp.fromDate(new Date(member.enrollmentDate as unknown as string)),
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

// Get all members
export async function getAllMembers(): Promise<Member[]> {
  const q = query(collection(db, MEMBERS_COLLECTION), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Member[]
}

// Get member by ID
export async function getMemberById(id: string): Promise<Member | null> {
  const docRef = doc(db, MEMBERS_COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Member
  }
  return null
}

// Search members by field
export async function searchMembers(
  field: "email" | "phone" | "lastName",
  value: string
): Promise<Member[]> {
  // For partial matching, we use >= and <= with special characters
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where(field, ">=", value),
    where(field, "<=", value + "\uf8ff")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Member[]
}

// Search members by name (first or last)
export async function searchMembersByName(name: string): Promise<Member[]> {
  const nameLower = name.toLowerCase()
  
  // Get all members and filter client-side for flexible name search
  const allMembers = await getAllMembers()
  return allMembers.filter(
    (member) =>
      member.firstName.toLowerCase().includes(nameLower) ||
      member.lastName.toLowerCase().includes(nameLower) ||
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(nameLower)
  )
}

// Combined search function
export async function searchMembersMultiField(searchTerm: string): Promise<Member[]> {
  const allMembers = await getAllMembers()
  const termLower = searchTerm.toLowerCase().trim()
  
  return allMembers.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase()
    const email = member.email.toLowerCase()
    const phone = member.phone.replace(/\D/g, "") // Remove non-digits for phone comparison
    const searchDigits = termLower.replace(/\D/g, "")
    
    return (
      fullName.includes(termLower) ||
      member.firstName.toLowerCase().includes(termLower) ||
      member.lastName.toLowerCase().includes(termLower) ||
      email.includes(termLower) ||
      (searchDigits && phone.includes(searchDigits))
    )
  })
}

export { db }

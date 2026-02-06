"use client"

import { initializeApp, getApps } from "firebase/app"
import {
  getFirestore,
  collection,
  setDoc,
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
  personId: string
  phone: string
  address: string
  leader: string | null
  votingPlace: string
  table: string
  memberType: "voter" | "leader" | "visualizer"
  notes?: string
  createdAt: Date | Timestamp
}

// Add a new member
export async function addMember(member: Omit<Member, "id" | "createdAt">) {
  const docRef = doc(db, MEMBERS_COLLECTION, member.personId)
  const snapshot = await getDoc(docRef)
  
  if (snapshot.exists()) {
    throw new Error(`La persona con cédula ${member.personId} ya está registrada.`)
  }
  
  await setDoc(docRef, {
    ...member,
    createdAt: Timestamp.now(),
  })
  return member.personId
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
  // field: "personId" | "table" | "membershipType" | "votingPlace",
  value: string
): Promise<Member[]> {
  // For partial matching, we use >= and <= with special characters
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where("personId", "==", value),
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
    const type = member.memberType
    const place = member.votingPlace.toLowerCase()
    const leader = member.leader?.toLowerCase()
    const personId = member.personId.toLowerCase()
    const phone = member.phone.replace(/\D/g, "") // Remove non-digits for phone comparison
    const searchDigits = termLower.replace(/\D/g, "")
    
    return (
      type.includes(termLower) ||
      leader && leader.includes(termLower) ||
      place.toLowerCase().includes(termLower) ||
      phone.includes(termLower) ||
      personId.includes(termLower)
    )
  })
}

// Filter members by multiple criteria
export interface MemberFilters {
  personId?: string
  memberType?: string
  leader?: string
  phone?: string
  votingPlace?: string
  table?: string
}

export async function filterMembersByCriteria(filters: MemberFilters): Promise<Member[]> {
  const constraints: any[] = []
  
  // Add exact match filters
  if (filters.personId) {
    constraints.push(where("personId", "==", filters.personId.toUpperCase()))
  }
  
  if (filters.table) {
    constraints.push(where("table", "==", filters.table.toUpperCase()))
  }
  
  if (filters.memberType) {
    constraints.push(where("membershipType", "==", filters.memberType))
  }
  
  // Add range query filters for partial text matching
  if (filters.leader) {
    const leaderLower = filters.leader.toLowerCase()
    constraints.push(where("leader", ">=", leaderLower))
    constraints.push(where("leader", "<=", leaderLower + "\uf8ff"))
  }
  
  if (filters.votingPlace) {
    const placeLower = filters.votingPlace.toLowerCase()
    constraints.push(where("votingPlace", ">=", placeLower))
    constraints.push(where("votingPlace", "<=", placeLower + "\uf8ff"))
  }
  
  // Build and execute query
  let q
  if (constraints.length > 0) {
    q = query(collection(db, MEMBERS_COLLECTION), ...constraints, orderBy("createdAt", "desc"))
  } else {
    q = query(collection(db, MEMBERS_COLLECTION), orderBy("createdAt", "desc"))
  }
  
  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Member[]
  
  // Client-side filtering for phone (since we need digit-only matching)
  if (filters.phone) {
    const phoneDigits = filters.phone.replace(/\D/g, "")
    results = results.filter((member) => {
      const memberPhoneDigits = member.phone.replace(/\D/g, "")
      return memberPhoneDigits.includes(phoneDigits)
    })
  }
  
  return results
}

export { db }


// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if
//           request.time < timestamp.date(2026, 3, 6);
//     }
//   }
// }

// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }
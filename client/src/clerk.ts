import { Clerk } from "@clerk/clerk-react"

// Initialize Clerk with your publishable key
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key")
}

export const clerk = new Clerk(clerkPubKey)

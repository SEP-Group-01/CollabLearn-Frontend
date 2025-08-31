import type React from "react"
import { ClerkProvider } from "@clerk/clerk-react"

interface ClerkWrapperProps {
  children: React.ReactNode
}

const ClerkWrapper: React.FC<ClerkWrapperProps> = ({ children }) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


  if (!clerkPubKey) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Missing Clerk Configuration</h2>
        <p>Please add your Clerk Publishable Key to your environment variables:</p>
        <code>VITE_CLERK_PUBLISHABLE_KEY=your_key_here</code>
      </div>
    )
  }

  return <ClerkProvider publishableKey={clerkPubKey}>{children}</ClerkProvider>
}

export default ClerkWrapper

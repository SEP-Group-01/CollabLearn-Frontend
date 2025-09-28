// Clerk configuration for environment variables
export const getClerkPublishableKey = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key");
  }
  
  return clerkPubKey;
};

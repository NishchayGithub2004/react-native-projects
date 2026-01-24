import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import '../global.css'

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Stack />
    </ClerkProvider>
  );
}
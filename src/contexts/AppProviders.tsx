import type { ReactNode } from "react";
import { SavedScholarshipProvider } from "./SavedScholarshipContext";
import { UIProvider } from "./UIContext";
import { AuthProvider } from "./AuthContext";
import { ShareDialog } from "@/features/sharing/ShareDialog";

/** Global providers that every route needs (UI state + saved shelf). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <SavedScholarshipProvider>
          {children}
          <ShareDialog />
        </SavedScholarshipProvider>
      </UIProvider>
    </AuthProvider>
  );
}

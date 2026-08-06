import { Link, useNavigate } from "@tanstack/react-router";
import {
  Compass,
  Sparkles,
  Bookmark,
  Bell,
  Settings,
  Home,
  UserRound,
  Loader2,
  FolderCheck,
  Bot,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { student } from "@/data/mock";
import { AiAdvisorModal } from "@/features/advisor/AiAdvisorModal";

const nav = [
  { to: "/dashboard", label: "Today", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/recommendations", label: "For you", icon: Sparkles },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/vault", label: "Vault", icon: FolderCheck },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [advisorOpen, setAdvisorOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({ to: "/auth" });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">Syncing profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] aurora opacity-70" />

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="glass mx-auto flex max-w-6xl items-center gap-3 rounded-full px-3 py-2 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full gradient-hero text-sm font-black text-primary-foreground">
              M
            </span>
            <span className="hidden font-display text-base font-bold sm:block">MeritMind</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-4.5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" />
            </Link>
            <Link
              to="/settings"
              aria-label="Settings"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings className="size-4.5" />
            </Link>
            <Link
              to="/profile"
              className="grid size-9 place-items-center rounded-full bg-ink text-xs font-bold text-background"
            >
              {student.initials || "ME"}
            </Link>
          </div>
        </div>
      </header>

      <main
        className={`relative mx-auto w-full px-4 pb-32 pt-8 sm:px-6 md:pb-16 ${
          wide ? "max-w-7xl" : "max-w-6xl"
        }`}
      >
        {children}
      </main>

      {/* AI Advisor Floating Action Button */}
      <button
        onClick={() => setAdvisorOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full gradient-hero px-4 py-3 text-sm font-bold text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
      >
        <Bot className="size-5" />
        <span className="hidden sm:inline">AI Advisor</span>
      </button>

      <AiAdvisorModal isOpen={advisorOpen} onClose={() => setAdvisorOpen(false)} />

      <nav className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <div className="glass flex items-center justify-between rounded-2xl px-2 py-1.5">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold text-muted-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CalendarClock, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { SectionHeading } from "@/components/meritmind/Bits";
import { useState, useEffect } from "react";
import { apiRequest } from "@/services/apiClient";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — MeritMind" },
      {
        name: "description",
        content:
          "Deadline reminders, new scholarship alerts, fresh matches and profile milestones — all in one quiet timeline.",
      },
      { property: "og:title", content: "Notifications — MeritMind" },
      {
        property: "og:description",
        content: "Deadline reminders, new listings and match alerts in one timeline.",
      },
    ],
  }),
  component: Notifications,
});

const icons = {
  deadline: CalendarClock,
  new: BellRing,
  match: Sparkles,
  profile: TrendingUp,
} as const;

function formatTimeAgo(isoString: string) {
  try {
    const date = new Date(isoString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  } catch {
    return "Recently";
  }
}

function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiRequest<any[]>("GET", "/notifications");
      setNotifications(res);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      await apiRequest("POST", `/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      // Revert on error
      fetchNotifications();
    }
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AppShell>
      <section className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full gradient-hero opacity-10" />
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent-foreground">
          <BellRing className="size-3.5" /> {unread} unread
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
          Your coach has been busy
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Nudges are sent at 14, 7 and 2 days before a deadline — plus a final morning-of reminder.
        </p>
      </section>

      <section className="mt-10">
        <SectionHeading eyebrow="Timeline" title="Latest activity" />
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="surface rounded-3xl p-8 text-center border border-dashed border-border bg-card/20">
            <p className="text-sm text-muted-foreground">You have no notifications yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => {
              const typeLower = (n.type || "Alert").toLowerCase();
              const kind =
                typeLower === "deadline"
                  ? "deadline"
                  : typeLower === "application" || typeLower === "reminder"
                  ? "profile"
                  : "new";
              const Icon = icons[kind] || BellRing;
              
              return (
                <li
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={`surface flex items-start gap-4 rounded-3xl p-5 cursor-pointer transition-all hover:bg-card/40 ${
                    !n.read ? "border-primary/30 bg-primary-soft/5" : ""
                  }`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="min-w-0 truncate text-sm font-bold">{n.title}</p>
                      {!n.read ? <span className="size-2 shrink-0 rounded-full bg-accent" /> : null}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.message}</p>
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">{formatTimeAgo(n.createdAt)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AppShell>
  );
}

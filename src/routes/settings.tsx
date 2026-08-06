import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Lock, Moon, LogOut } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/meritmind/AppShell";
import { SectionHeading } from "@/components/meritmind/Bits";
import { Switch } from "@/components/ui/switch";
import { student } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MeritMind" },
      {
        name: "description",
        content:
          "Manage your MeritMind account: profile basics, appearance, reminder preferences and privacy controls.",
      },
      { property: "og:title", content: "Settings — MeritMind" },
      {
        property: "og:description",
        content: "Profile, theme, notification and privacy preferences.",
      },
    ],
  }),
  component: Settings,
});

function Row({
  title,
  body,
  checked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border p-4">
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [newListings, setNewListings] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [discoverable, setDiscoverable] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const toggleTheme = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out.");
    navigate({ to: "/auth" });
  };

  return (
    <AppShell>
      <section className="surface rounded-[2rem] p-6 sm:p-8">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tune how MeritMind coaches you. Changes save automatically.
        </p>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface rounded-[2rem] p-6">
          <SectionHeading eyebrow="Account" title="Profile basics" />
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-3xl gradient-hero font-display font-black text-primary-foreground">
              {student.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{student.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {student.course} · {student.branch} · {student.city}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto shrink-0 rounded-full border border-destructive bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="mr-1 inline size-3.5" /> Log Out
            </button>
          </div>
        </div>

        <div className="surface rounded-[2rem] p-6">
          <SectionHeading eyebrow="Appearance" title="Theme" />
          <Row
            title="Dark mode"
            body="Easier on the eyes during late-night applications."
            checked={dark}
            onChange={toggleTheme}
          />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Moon className="size-3.5" /> Follows your choice on this device.
          </p>
        </div>

        <div className="surface rounded-[2rem] p-6">
          <SectionHeading eyebrow="Reminders" title="Notifications" />
          <div className="space-y-3">
            <Row
              title="Deadline reminders"
              body="Nudges at 14, 7 and 2 days before closing."
              checked={deadlineAlerts}
              onChange={setDeadlineAlerts}
            />
            <Row
              title="New scholarships"
              body="Alert me when official portals publish new listings."
              checked={newListings}
              onChange={setNewListings}
            />
            <Row
              title="Weekly digest"
              body="A Sunday summary of your best matches."
              checked={weekly}
              onChange={setWeekly}
            />
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Bell className="size-3.5" /> Delivered in-app for now.
          </p>
        </div>

        <div className="surface rounded-[2rem] p-6">
          <SectionHeading eyebrow="Privacy" title="Data & visibility" />
          <div className="space-y-3">
            <Row
              title="Discoverable profile"
              body="Let verified providers see your anonymised profile."
              checked={discoverable}
              onChange={setDiscoverable}
            />
            <Row
              title="Improve recommendations"
              body="Use my activity to sharpen future match scores."
              checked={analytics}
              onChange={setAnalytics}
            />
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5" /> Your documents are never shared without consent.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

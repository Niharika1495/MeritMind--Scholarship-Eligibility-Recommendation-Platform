import { Check, Copy, Link2, Mail, MessageCircle, Share2, Twitter } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUI } from "@/contexts/UIContext";
import { inr } from "@/utils/format";

/** Reusable share URL builder — points at the deployed detail route. */
export function scholarshipShareUrl(id: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://meritmind.app";
  return `${origin}/scholarship/${id}`;
}

export function ShareDialog() {
  const { shareTarget, closeShare } = useUI();
  const [copied, setCopied] = useState(false);

  const s = shareTarget;
  const url = s ? scholarshipShareUrl(s.id) : "";
  const text = s ? `${s.name} — ${inr(s.amount)}/year via ${s.provider}. Found on MeritMind.` : "";

  const channels = s
    ? [
        {
          label: "WhatsApp",
          icon: MessageCircle,
          href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        },
        {
          label: "X / Twitter",
          icon: Twitter,
          href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        },
        {
          label: "Email",
          icon: Mail,
          href: `mailto:?subject=${encodeURIComponent(s.name)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
        },
      ]
    : [];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={Boolean(s)} onOpenChange={(open) => !open && closeShare()}>
      <DialogContent className="glass max-w-md rounded-3xl border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
            <Share2 className="size-4 text-primary" /> Share this scholarship
          </DialogTitle>
          <DialogDescription className="text-sm">
            {s ? `${s.name} · ${s.provider}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="surface lift flex flex-col items-center gap-2 rounded-2xl p-4 text-xs font-bold"
            >
              <c.icon className="size-5 text-primary" />
              {c.label}
            </a>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-2 rounded-2xl bg-muted p-2 pl-4">
          <Link2 className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-muted-foreground">
            {url}
          </span>
          <button
            onClick={copy}
            className="shrink-0 rounded-full gradient-hero px-3.5 py-2 text-xs font-bold text-primary-foreground"
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Copy className="size-3.5" /> Copy
              </span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

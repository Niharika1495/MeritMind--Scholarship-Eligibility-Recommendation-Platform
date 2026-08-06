import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortOptions } from "@/services/scholarshipService";
import type { SortKey } from "@/types/scholarship";

export function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" />
      <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
        <SelectTrigger className="w-[168px] rounded-full border-border bg-card text-xs font-bold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {sortOptions.map((o) => (
            <SelectItem key={o.key} value={o.key} className="text-xs font-semibold">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

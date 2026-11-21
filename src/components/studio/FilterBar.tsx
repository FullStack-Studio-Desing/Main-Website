"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Search box plus a status select, used above the CRM tables. "all" means no status filter. */
export function FilterBar({
  query,
  onQuery,
  placeholder,
  status,
  onStatus,
  statuses,
}: {
  query: string;
  onQuery: (value: string) => void;
  placeholder: string;
  status: string;
  onStatus: (value: string) => void;
  statuses: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-9 pl-8"
        />
      </div>
      <Select value={status} onValueChange={onStatus}>
        <SelectTrigger className="h-9 px-3 text-sm sm:w-[160px]" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="studio-app">
          <SelectItem value="all">All statuses</SelectItem>
          {statuses.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function matches(query: string, ...fields: (string | null | undefined)[]) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((field) => field?.toLowerCase().includes(needle));
}

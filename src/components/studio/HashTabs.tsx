"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Tabs whose active value follows the URL hash, so server actions that redirect to
 * `/admin/clients/<id>#payments` land on the right tab.
 */
export function HashTabs({
  tabs,
  defaultValue,
  children,
}: {
  tabs: { value: string; label: string; count?: number }[];
  defaultValue: string;
  children: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (tabs.some((tab) => tab.value === hash)) setValue(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [tabs]);

  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        setValue(next);
        window.history.replaceState(null, "", `#${next}`);
      }}
    >
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <TabsList className="w-max">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
              {tab.label}
              {tab.count ? (
                <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">
                  {tab.count}
                </span>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}

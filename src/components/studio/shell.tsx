"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import {
  BarChart3,
  Building2,
  ChevronsUpDown,
  CreditCard,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { initials } from "@/components/studio/ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { brand } from "@/data/site-copy";
import { signOut } from "@/lib/portal/actions";
import { cn } from "@/lib/utils";

// Icons are referenced by key so server layouts can pass plain nav data.
const navIcons = {
  dashboard: LayoutDashboard,
  clients: Users,
  projects: FolderKanban,
  invoices: FileText,
  payments: CreditCard,
  support: LifeBuoy,
  reports: BarChart3,
  company: Building2,
  wallet: Wallet,
} satisfies Record<string, LucideIcon>;

export type StudioNavIcon = keyof typeof navIcons;
export type StudioNavItem = { href: string; label: string; icon?: StudioNavIcon; badge?: number };

export function StudioShell({
  homeHref,
  nav,
  pathname: initialPathname,
  email,
  preview = false,
  children,
}: {
  homeHref: string;
  nav: StudioNavItem[];
  pathname: string;
  email?: string;
  preview?: boolean;
  children: ReactNode;
}) {
  // The layout's pathname is frozen at first render; usePathname tracks client navigation.
  const pathname = usePathname() ?? initialPathname;

  return (
    <div className="studio-app flex h-dvh overflow-hidden bg-background text-foreground">
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r bg-muted/40 lg:flex">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <BrandLockup href={homeHref} />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks nav={nav} pathname={pathname} />
        </div>
        <div className="border-t p-3">
          <AccountMenu email={email} preview={preview} variant="sidebar" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 lg:hidden">
          <MobileNav homeHref={homeHref} nav={nav} pathname={pathname} preview={preview} />
          <BrandLockup href={homeHref} compact />
          <div className="ml-auto">
            <AccountMenu email={email} preview={preview} variant="header" />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function isActive(href: string, pathname: string) {
  if (href === "/admin" || href === "/portal") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  nav,
  pathname,
  onNavigate,
}: {
  nav: StudioNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = isActive(item.href, pathname);
        const Icon = navIcons[item.icon ?? "dashboard"];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <Badge variant="secondary" className="ml-auto shrink-0 tabular-nums">
                {item.badge > 99 ? "99+" : item.badge}
              </Badge>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({
  homeHref,
  nav,
  pathname,
  preview,
}: {
  homeHref: string;
  nav: StudioNavItem[];
  pathname: string;
  preview: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="-ml-2 size-9">
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="studio-app flex w-72 flex-col gap-0 p-0">
        <SheetHeader className="h-14 flex-row items-center space-y-0 border-b px-4 text-left">
          <SheetTitle asChild>
            <div>
              <BrandLockup href={homeHref} onNavigate={() => setOpen(false)} />
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">Studio navigation</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {preview ? (
            <Badge variant="outline" className="mb-3 ml-3">
              Preview
            </Badge>
          ) : null}
          <NavLinks nav={nav} pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BrandLockup({
  href,
  compact = false,
  onNavigate,
}: {
  href: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link href={href} onClick={onNavigate} className="flex min-w-0 items-center gap-2 text-foreground">
      <LogoMark className="size-6 shrink-0" tone="ink" />
      <span className="truncate text-base font-semibold tracking-tight">
        {compact ? "Studio" : brand.shortName}
      </span>
    </Link>
  );
}

function AccountMenu({
  email,
  preview,
  variant,
}: {
  email?: string;
  preview: boolean;
  variant: "sidebar" | "header";
}) {
  const [pending, startTransition] = useTransition();
  const name = email ?? (preview ? "Preview mode" : "Signed in");
  const avatar = (
    <Avatar className="size-8 rounded-md">
      <AvatarFallback className="rounded-md bg-primary text-xs font-medium text-primary-foreground">
        {email ? initials(email.split("@")[0]) : "FS"}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "sidebar" ? (
          <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-2 py-2 text-left">
            {avatar}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{name}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {preview ? "Sample data" : "Admin"}
              </span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="size-9 rounded-md">
            {avatar}
            <span className="sr-only">Account menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "sidebar" ? "start" : "end"}
        side={variant === "sidebar" ? "top" : "bottom"}
        className="studio-app w-56"
      >
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <ExternalLink className="size-4" />
            View site
          </Link>
        </DropdownMenuItem>
        {preview ? null : (
          <DropdownMenuItem
            disabled={pending}
            onSelect={() => startTransition(() => signOut())}
          >
            <LogOut className="size-4" />
            {pending ? "Signing out" : "Sign out"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

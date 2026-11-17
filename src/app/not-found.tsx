import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { btnInverse } from "@/components/buttons";
import { brand } from "@/data/site-copy";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-paper px-6">
      <Link href="/" className="mx-auto flex w-full max-w-[1536px] items-center gap-2.5 py-6 text-ink">
        <LogoMark className="h-8 w-8" tone="ink" />
        <span className="text-xl font-bold tracking-tight">
          {brand.shortName}
          <span className="text-leaf">.</span>
        </span>
      </Link>
      <div className="flex flex-1 items-center justify-center pb-24 text-center">
        <div>
          <h1 className="font-display text-[44px] uppercase leading-[0.95] tracking-[-0.01em] text-sage sm:text-[64px]">
            This page does <span className="text-neon-active">not exist</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[40ch] text-base leading-relaxed text-body">
            The page you are looking for was moved or removed in our latest redesign.
          </p>
          <Link href="/" className={`${btnInverse} mt-10`}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

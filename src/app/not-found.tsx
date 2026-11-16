import Link from "next/link";
import { btnInverse } from "@/components/buttons";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-paper px-6 pt-20">
      <div className="text-center">
        <h1 className="font-display text-[44px] uppercase leading-[0.95] tracking-[-0.01em] text-sage sm:text-[64px]">
          This page does <span className="text-neon-active">not exist</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[40ch] text-base leading-relaxed text-body">
          The page you are looking for was moved or removed in our latest
          redesign.
        </p>
        <Link href="/" className={`${btnInverse} mt-10`}>
          Back to home
        </Link>
      </div>
    </main>
  );
}

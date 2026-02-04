import Link from "next/link";
import { notFoundCopy } from "@/data/site-copy";
import { MovingBorder } from "@/components/ui/moving-border";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-4 dark:bg-neutral-900">
      <p className="text-6xl font-bold text-neutral-300 dark:text-neutral-600">
        {notFoundCopy.code}
      </p>
      <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
        {notFoundCopy.headline}
      </h1>
      <p className="mt-4 max-w-md text-center text-neutral-600 dark:text-neutral-400">
        {notFoundCopy.description}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <MovingBorder
          as={Link}
          href="/"
          borderRadius="0.5rem"
          className="bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          {notFoundCopy.backHome}
        </MovingBorder>
        <MovingBorder
          as={Link}
          href="/contact"
          borderRadius="0.5rem"
          className="border border-neutral-300 bg-transparent px-6 py-3 font-semibold text-neutral-900 dark:border-neutral-600 dark:text-white"
        >
          {notFoundCopy.contactMe}
        </MovingBorder>
      </div>
    </main>
  );
}

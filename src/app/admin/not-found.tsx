import Link from "next/link";
import { btnInverse } from "@/components/buttons";

export default function AdminNotFound() {
  return (
    <div>
      <h1 className="font-display text-[36px] uppercase leading-[0.95] text-ink sm:text-[48px]">
        That client page is missing
      </h1>
      <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-body">
        The record may have been deleted, or the link is out of date.
      </p>
      <Link href="/admin" className={`${btnInverse} mt-8`}>
        Back to clients
      </Link>
    </div>
  );
}

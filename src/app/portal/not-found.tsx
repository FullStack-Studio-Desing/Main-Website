import Link from "next/link";
import { btnInverse } from "@/components/buttons";

export default function PortalNotFound() {
  return (
    <div>
      <h1 className="font-display text-[36px] uppercase leading-[0.95] text-ink sm:text-[48px]">
        That report is not available
      </h1>
      <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-body">
        It may still be a draft, or it belongs to another company.
      </p>
      <Link href="/portal" className={`${btnInverse} mt-8`}>
        Back to your plan
      </Link>
    </div>
  );
}

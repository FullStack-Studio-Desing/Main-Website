import { redirect } from "next/navigation";

/**
 * Services listing at /service (matches minifolio-next route).
 * Redirects to /services which renders the same content.
 */
export default function ServicePage() {
  redirect("/services");
}

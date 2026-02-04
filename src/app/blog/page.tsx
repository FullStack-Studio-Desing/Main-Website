import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { blog } from "@/data/site-copy";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export const metadata = {
  title: "Blog — FullStack Studio Design",
  description: "Latest posts on web development, design systems, and UI/UX.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <Breadcrumb title="Blog" />
      <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              {blog.headline}
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blog.posts.map((post) => (
              <CardSpotlight key={post.title}>
                <article className="p-6">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {post.category}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {post.date}
                  </p>
                  <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {post.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="mt-4 inline-block text-sm font-medium text-neutral-900 underline dark:text-white"
                  >
                    Read More
                  </Link>
                </article>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

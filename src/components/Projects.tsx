import { supabasePublic } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";

export const revalidate = 0;

export default async function Projects() {
  const { data } = await supabasePublic
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const projects = (data ?? []) as Project[];

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32"
    >
      <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Projects
      </h2>
      <p className="mt-4 text-2xl font-medium text-zinc-900 sm:text-3xl dark:text-zinc-100">
        A few things I&apos;ve built
      </p>

      {projects.length === 0 ? (
        <p className="mt-12 text-sm text-zinc-500 dark:text-zinc-400">
          Projects coming soon.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center text-sm font-medium text-zinc-950 dark:text-zinc-50">
                View project
                <span className="ml-1 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

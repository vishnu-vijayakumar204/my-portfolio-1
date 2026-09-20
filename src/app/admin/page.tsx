import { getSupabaseAdmin } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";
import ProjectRow from "./ProjectRow";
import NewProjectForm from "./NewProjectForm";
import { logout } from "./actions";

export default async function AdminPage() {
  const { data, error } = await getSupabaseAdmin()
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const projects = (data ?? []) as Project[];

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Manage projects
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Changes appear on the homepage immediately.
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
          >
            Log out
          </button>
        </form>
      </div>

      {error ? (
        <p className="mt-8 text-sm text-red-600 dark:text-red-400">
          Failed to load projects: {error.message}
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
          {projects.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No projects yet — add your first one below.
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-8">
        <NewProjectForm />
      </div>
    </div>
  );
}

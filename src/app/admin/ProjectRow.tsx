"use client";

import { useState, useTransition } from "react";
import type { Project } from "@/lib/supabase";
import { deleteProject, updateProject } from "./actions";
import { useToast } from "@/components/Toast";

const fieldClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export default function ProjectRow({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const showToast = useToast();

  function handleUpdate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateProject(project.id, formData);
        setEditing(false);
        showToast("Project updated.", "success");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong.";
        setError(message);
        showToast(`Failed to update project: ${message}`, "error");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteProject(project.id);
        showToast("Project deleted.", "success");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong.";
        setError(message);
        showToast(`Failed to delete project: ${message}`, "error");
      }
    });
  }

  if (editing) {
    return (
      <form
        action={handleUpdate}
        className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <input
          name="title"
          defaultValue={project.title}
          required
          placeholder="Title"
          className={fieldClass}
        />
        <textarea
          name="description"
          defaultValue={project.description}
          required
          rows={3}
          placeholder="Description"
          className={fieldClass}
        />
        <input
          name="tags"
          defaultValue={project.tags.join(", ")}
          placeholder="Tags, comma separated"
          className={fieldClass}
        />
        <input
          name="link"
          defaultValue={project.link}
          placeholder="Link (https://...)"
          className={fieldClass}
        />
        <input
          name="sort_order"
          type="number"
          defaultValue={project.sort_order}
          placeholder="Sort order"
          className={fieldClass}
        />

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
        {error ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 disabled:opacity-60 dark:border-red-900 dark:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

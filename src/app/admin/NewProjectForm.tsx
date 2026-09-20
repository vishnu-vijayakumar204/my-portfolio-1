"use client";

import { useRef, useState, useTransition } from "react";
import { createProject } from "./actions";
import { useToast } from "@/components/Toast";

const fieldClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export default function NewProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const showToast = useToast();

  function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createProject(formData);
        formRef.current?.reset();
        showToast("Project added.", "success");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong.";
        setError(message);
        showToast(`Failed to add project: ${message}`, "error");
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleCreate}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
    >
      <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Add a new project
      </h3>
      <input name="title" required placeholder="Title" className={fieldClass} />
      <textarea
        name="description"
        required
        rows={3}
        placeholder="Description"
        className={fieldClass}
      />
      <input
        name="tags"
        placeholder="Tags, comma separated (e.g. Next.js, TypeScript)"
        className={fieldClass}
      />
      <input name="link" placeholder="Link (https://...)" className={fieldClass} />
      <input
        name="sort_order"
        type="number"
        defaultValue={0}
        placeholder="Sort order"
        className={fieldClass}
      />

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
      >
        {isPending ? "Adding…" : "Add project"}
      </button>
    </form>
  );
}

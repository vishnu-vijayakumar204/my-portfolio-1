"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { destroyAdminSession, isAdminAuthenticated } from "@/lib/admin-auth";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

function parseProjectForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim() || "#";
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  return { title, description, link, tags, sort_order: sortOrder };
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const project = parseProjectForm(formData);

  const { error } = await getSupabaseAdmin().from("projects").insert(project);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const project = parseProjectForm(formData);

  const { error } = await getSupabaseAdmin()
    .from("projects")
    .update(project)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  await requireAdmin();

  const { error } = await getSupabaseAdmin()
    .from("projects")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

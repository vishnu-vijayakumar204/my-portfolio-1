"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyPassword } from "@/lib/admin-auth";

export async function login(_prevState: { error: string }, formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  redirect("/admin");
}

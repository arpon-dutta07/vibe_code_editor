"use server";

import { signIn } from "@/auth";

export async function handleGoogleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function handleGithubSignIn() {
  await signIn("github", { redirectTo: "/dashboard" });
}

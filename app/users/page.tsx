import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function UsersRootPage() {
  const session = await auth()
  
  if (session?.user?.id) {
    redirect(`/users/${session.user.id}`)
  } else {
    redirect("/dashboard")
  }
}

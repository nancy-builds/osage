import { use } from "react"
import LoginForm from "@/components/LoginForm"

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = use(searchParams) // ✅ unwrap here

  return (
    <main className="flex items-start justify-center my-10">
      <LoginForm redirect={redirect} />
    </main>
  )
}

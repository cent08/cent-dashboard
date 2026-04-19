import { redirect } from 'next/navigation'

export default function RootPage() {
  // TODO: Check auth state — if logged in go to dashboard, otherwise login
  // For now, redirect to login
  redirect('/login')
}

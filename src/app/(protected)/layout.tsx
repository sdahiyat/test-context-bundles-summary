import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import AppNav from '@/components/AppNav'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

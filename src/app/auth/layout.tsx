import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-center pt-8 pb-4">
        <Link
          href="/"
          className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
        >
          NutriTrack
        </Link>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

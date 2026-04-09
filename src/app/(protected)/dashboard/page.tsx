import { createServerSupabaseClient } from '@/lib/supabase'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userEmail = session?.user?.email ?? 'there'
  const displayName = userEmail.split('@')[0]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {displayName}! 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Here&apos;s your nutrition summary for today.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Calories Today
          </p>
          <p className="text-3xl font-bold text-gray-900">—</p>
          <p className="text-xs text-gray-400 mt-1">Goal: — kcal</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Macros
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-600 font-medium">Protein</span>
              <span className="text-gray-700">— g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600 font-medium">Carbs</span>
              <span className="text-gray-700">— g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500 font-medium">Fat</span>
              <span className="text-gray-700">— g</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Meals Logged
          </p>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-400 mt-1">No meals logged yet today</p>
        </div>
      </div>

      {/* Recent meals placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent Meals</h2>
          <a
            href="/log"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            + Log meal
          </a>
        </div>
        <div className="px-5 py-10 text-center">
          <p className="text-gray-400 text-sm">No meals logged yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Start tracking by logging your first meal.
          </p>
        </div>
      </div>
    </div>
  )
}

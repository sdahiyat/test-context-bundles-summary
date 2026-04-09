import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">NutriTrack</span>
          <nav className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="btn-secondary text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary text-sm"
            >
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span>✨</span>
          <span>AI-Powered Nutrition Tracking</span>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Track nutrition
          <br />
          <span className="text-primary-600">effortlessly with AI</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Snap a photo of your meal, and NutriTrack instantly identifies the food and
          calculates calories and macros — no manual entry needed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/signup" className="btn-primary text-base px-6 py-3">
            Start tracking free
          </Link>
          <Link href="/auth/login" className="btn-secondary text-base px-6 py-3">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything you need to reach your goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                📸
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Photo Logging</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Photograph your meal and let AI do the work. Instant food identification and
                nutritional analysis in seconds.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                📊
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Tracking</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Monitor calories, protein, carbs, and fats with beautiful dashboards that
                make your progress clear and motivating.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                🎯
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalized Goals</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Set custom calorie and macro targets based on your weight goals, activity
                level, and dietary preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to take control of your nutrition?
          </h2>
          <p className="text-gray-500 mb-8">
            Join thousands of users tracking their health with NutriTrack. Free to get
            started.
          </p>
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-3">
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-sm text-gray-400">
          <span className="font-semibold text-primary-600">NutriTrack</span>
          <span>© {new Date().getFullYear()} NutriTrack. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}

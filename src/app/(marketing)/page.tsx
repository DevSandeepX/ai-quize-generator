import NavItems from '@/components/NavItems'
import { formatNumber } from '@/lib/utils'
import { getPublicStats } from '@/server/db/analytic'
import Link from 'next/link'
import React from 'react'

export default function MarketingPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <span className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              🎯 Practice, Attempt & Track Your Progress
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-3xl lg:text-5xl">
              Test Your <span className="text-indigo-400">Knowledge</span> with Interactive Quizzes
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg lg:mx-0">
              Sign in to attempt quizzes, view your scores instantly, track your
              progress, and improve your learning with topic-wise tests and real-time results.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/quizes" className="w-full sm:w-auto">
                <button className="w-full rounded-xl bg-indigo-600 px-8 py-4 font-semibold transition hover:bg-indigo-700">
                  Explore Quizzes
                </button>
              </Link>

              <Link href="/my-attempts" className="w-full sm:w-auto">
                <button className="w-full rounded-xl border border-slate-700 px-8 py-4 font-semibold transition hover:bg-slate-800">
                  My Results
                </button>
              </Link>
            </div>

            <SuspendedPublicStats />
          </div>

          {/* Right Side */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">Quiz</p>
                  <h3 className="font-semibold">
                    JavaScript Fundamentals
                  </h3>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">Questions</p>
                  <h3 className="font-semibold">
                    20 Questions • 30 Minutes
                  </h3>
                </div>

                <div className="rounded-xl bg-indigo-600 p-4">
                  <h3 className="font-semibold">
                    🏆 Score: 18 / 20 (90%)
                  </h3>
                  <p className="mt-1 text-sm text-indigo-100">
                    Great job! Keep learning and improve your ranking.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/20 blur-3xl md:h-32 md:w-32"></div>
            <div className="absolute -left-4 bottom-0 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl md:h-40 md:w-40"></div>
          </div>
        </div>


      </div>
    </section>
  )
}
function StatsCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white">
        {value}
      </h3>
      <p className="text-slate-400">{title}</p>
    </div>
  );
}

async function SuspendedPublicStats() {
  const data = await getPublicStats()
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 text-center sm:grid-cols-3 lg:text-left">
      <StatsCard title='Available Quizzes' value={formatNumber(data.quizzes)} />
      <StatsCard title='Quiz Attempts' value={formatNumber(data.attempts)} />
      <StatsCard title='Active Students' value={formatNumber(data.users)} />
    </div>
  )
}
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl py-16">
      <div className="rounded-3xl border-2 border-black bg-white p-8 shadow-[8px_8px_0px_#000] md:p-12">
        <span className="inline-block rounded-full bg-black px-3 py-1 font-mono text-xs font-bold tracking-[0.3em] text-white uppercase">
          About Kineq
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          A calmer way to track what you are watching.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 md:text-lg">
          Kineq helps you organize ongoing shows, watchlists, and completed
          folders without the clutter of a heavy streaming dashboard. It is
          built for people who want a fast, personal, and simple space to keep
          track of every drama or anime episode.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Track faster",
              text: "Keep ongoing and watchlist items close with minimal clicks.",
            },
            {
              title: "Stay organized",
              text: "Move items into completed folders and keep your history clean.",
            },
            {
              title: "Lightweight by design",
              text: "Small UI, quick actions, and a focused experience across devices.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border-2 border-black p-5 shadow-[4px_4px_0px_#000]"
            >
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/watchlist"
            className="rounded-2xl border-2 border-black bg-black px-5 py-3 font-bold text-white shadow-[4px_4px_0px_#555] transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Go to watchlist
          </Link>
          <Link
            href="/"
            className="rounded-2xl border-2 border-black bg-white px-5 py-3 font-bold text-black shadow-[4px_4px_0px_#555] transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

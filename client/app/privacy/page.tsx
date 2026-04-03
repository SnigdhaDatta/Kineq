import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl py-16">
      <div className="rounded-3xl border-2 border-black bg-white p-8 shadow-[8px_8px_0px_#000] md:p-12">
        <span className="inline-block rounded-full bg-black px-3 py-1 font-mono text-xs font-bold tracking-[0.3em] text-white uppercase">
          Privacy Policy
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          Your data stays under your control.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 md:text-lg">
          Kineq stores account and app data only to keep your watchlists,
          ongoing items, completed folders, and authentication working. We do
          not sell personal data.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "What we store",
              text: "Account details, session tokens, and the data you add inside the app.",
            },
            {
              title: "Why we store it",
              text: "To make login, sync, Redis cache, and your personal watch tracking work.",
            },
            {
              title: "What we do not do",
              text: "We do not sell your data or use it for unrelated advertising purposes.",
            },
            {
              title: "Cache note",
              text: "Short-lived Redis cache entries may expire automatically to improve performance.",
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
            href="/"
            className="rounded-2xl border-2 border-black bg-black px-5 py-3 font-bold text-white shadow-[4px_4px_0px_#555] transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Back home
          </Link>
          <Link
            href="/feedback"
            className="rounded-2xl border-2 border-black bg-white px-5 py-3 font-bold text-black shadow-[4px_4px_0px_#555] transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Give feedback
          </Link>
        </div>
      </div>
    </div>
  );
}

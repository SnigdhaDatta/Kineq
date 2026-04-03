import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl py-16">
      <div className="rounded-3xl border-2 border-black bg-white p-8 shadow-[8px_8px_0px_#000] md:p-12">
        <span className="inline-block rounded-full bg-black px-3 py-1 font-mono text-xs font-bold tracking-[0.3em] text-white uppercase">
          Terms of Use
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          A few simple rules for using Kineq.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 md:text-lg">
          By using Kineq, you agree to use the app responsibly, keep your login
          details secure, and respect the intended use of the service.
        </p>

        <div className="mt-10 space-y-4">
          {[
            "You are responsible for the accuracy of the data you add.",
            "Do not attempt to misuse, overload, or attack the application.",
            "Account access is personal and should not be shared in a harmful way.",
            "We may update features, limits, or policies as the product evolves.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border-2 border-black p-5 shadow-[4px_4px_0px_#000]"
            >
              <p className="text-sm leading-6 text-gray-700">{item}</p>
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
            href="/about"
            className="rounded-2xl border-2 border-black bg-white px-5 py-3 font-bold text-black shadow-[4px_4px_0px_#555] transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            About Kineq
          </Link>
        </div>
      </div>
    </div>
  );
}

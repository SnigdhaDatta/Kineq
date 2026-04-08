import Link from "next/link";
import RouteProtector from "@/middleware/routematcher";

export default function FeedbackPage() {
  return (
    <div className="mx-auto w-full max-w-4xl py-16">
      <RouteProtector />
      <span className="inline-block rounded-full bg-black px-3 py-1 font-mono text-xs font-bold tracking-[0.3em] text-white uppercase">
        Feedback
      </span>
      <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
        Tell us what should feel better.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-700 md:text-lg">
        If something feels slow, confusing, or missing, send your thoughts. This
        page is a simple entry point for feedback while the product stays
        lightweight.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="mailto:hello@kineq.app?subject=Kineq%20Feedback"
          className="rounded-2xl border-2 border-black bg-black px-5 py-4 font-bold text-white shadow-[4px_4px_0px_#555] transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Email feedback
        </a>
        <Link
          href="/"
          className="rounded-2xl border-2 border-black bg-white px-5 py-4 font-bold text-black shadow-[4px_4px_0px_#555] transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Back home
        </Link>
      </div>

      <div className="mt-10 pt-8">
        <h2 className="text-xl font-bold">What to share</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
          <li>• What page or action felt confusing</li>
          <li>• What you wanted to do instead</li>
          <li>• Any browser or device issue you noticed</li>
          <li>• Any more features you want to see in the app</li>
          <li>• Your overall experience using the app</li>
          <li>• A rating for the app and why you gave it that score</li>
        </ul>
      </div>
    </div>
  );
}

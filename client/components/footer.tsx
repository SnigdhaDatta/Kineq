import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t-2 border-black text-black">
      <div className=" mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/totoro.svg"
                alt="Kineq logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full bg-white border-2 border-black"
              />
              <span className="text-black font-extrabold text-lg font-sans">
                Kineq
              </span>
            </div>
          </Link>
          <span className="text-xs text-neutral-400 sm:ml-4">
            © {new Date().getFullYear()} Snigdha Datta
          </span>
        </div>
        <div className="flex gap-4 flex-wrap justify-center text-sm">
          <a href="/about" className="hover:underline text-black font-semibold">
            About
          </a>
          <a
            href="/feedback"
            className="hover:underline text-black font-semibold"
          >
            Feedback
          </a>
          <a
            href="/privacy"
            className="hover:underline text-black font-semibold"
          >
            Privacy
          </a>
          <a href="/terms" className="hover:underline text-black font-semibold">
            Terms
          </a>
        </div>
        <div className="text-center sm:text-right">
          <a
            href="mailto:hello@kineq.app"
            className="text-black hover:underline text-sm font-semibold"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

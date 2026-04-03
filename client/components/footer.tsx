import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t-2 border-white text-white">
      <div className=" mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="https://img.icons8.com/doodle/48/film-reel--v1.png"
                alt="Kineq logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full bg-white border-2 border-white"
              />
              <span className="text-white font-extrabold text-lg font-sans">
                Kineq
              </span>
            </div>
          </Link>
          <span className="text-xs text-gray-400 sm:ml-4">
            © {new Date().getFullYear()} Snigdha Datta
          </span>
        </div>
        <div className="flex gap-4 flex-wrap justify-center text-sm">
          <Link
            href="/about"
            className="hover:underline text-white font-semibold"
          >
            About
          </Link>
          <Link
            href="/feedback"
            className="hover:underline text-white font-semibold"
          >
            Feedback
          </Link>
          <Link
            href="/privacy"
            className="hover:underline text-white font-semibold"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:underline text-white font-semibold"
          >
            Terms
          </Link>
        </div>
        <div className="text-center sm:text-right">
          <Link
            href="mailto:hello@kineq.app"
            className="text-white hover:underline text-sm font-semibold"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

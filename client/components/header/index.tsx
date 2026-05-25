import Image from "next/image";
import { UserMenu } from "./user-menu";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white/60 backdrop-blur-lg border-b-2 border-black sticky top-0 z-50">
      <div className="mx-auto px-2 py-3 sm:px-4 sm:py-4 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 min-w-0 shrink">
          <Image
            src="https://img.icons8.com/doodle/48/film-reel--v1.png"
            alt="Kineq logo"
            width={36}
            height={36}
            className="rounded-full bg-white"
            priority
          />
          <span className="text-black font-extrabold text-lg sm:text-2xl font-sans leading-none">
            Kineq
          </span>
        </Link>

        {/* Spacer */}
        <div />

        {/* User Menu - Client Component */}
        <UserMenu />
      </div>
    </header>
  );
}

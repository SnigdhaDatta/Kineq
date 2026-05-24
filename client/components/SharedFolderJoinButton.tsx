"use client";

import Link from "next/link";
import Image from "next/image";

export default function SharedFolderJoinButton() {
  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 sm:bottom-6">
      <Link
        href="/signup"
        className="group relative inline-flex items-center gap-2 rounded-full px-[1.5px] py-[1.5px] text-sm text-neutral-50 font-bold font-mono tracking-tight text-black transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
      >
        <span className="glow-animate absolute inset-0 rounded-full blur-[5px] opacity-70" />
        <span className="glow-animate absolute inset-0 rounded-full p-[1.5px]" />
        <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/90">
            <Image
              src="https://img.icons8.com/doodle/48/film-reel--v1.png"
              alt="Kineq logo"
              width={28}
              height={28}
              className="h-6 w-6"
            />
          </span>
          <span className="whitespace-nowrap">Join Kineq</span>
        </span>
      </Link>
    </div>
  );
}

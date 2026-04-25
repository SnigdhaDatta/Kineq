"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ClipboardList,
  FolderOpen,
  Sparkles,
  Play,
  CheckCircle2,
  Star,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

/* ── Intersection Observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── FAQ Accordion Item ── */
function FAQItem({
  q,
  a,
  delay,
  inView,
}: {
  q: string;
  a: string;
  delay: string;
  inView: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-2 border-black rounded-2xl overflow-hidden card-hover"
      style={
        inView
          ? {
              animation: "fadeUp 0.6s ease forwards",
              animationDelay: delay,
              opacity: 0,
            }
          : { opacity: 0 }
      }
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white"
      >
        <span className="font-bold text-gray-900 pr-4 leading-snug">{q}</span>
        <ChevronDown
          className="flex-shrink-0 w-5 h-5 text-black transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? "200px" : "0px",
          transition: "max-height 0.35s ease",
          overflow: "hidden",
        }}
      >
        <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t-2 border-dashed border-gray-200 pt-4">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) =>
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const features = useInView();
  const howIt = useInView();
  const faq = useInView();
  const cta = useInView();

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <style>{`
        @keyframes fadeUp    { from { opacity:0; transform:translateY(32px);  } to { opacity:1; transform:translateY(0);   } }
        @keyframes fadeIn    { from { opacity:0;                              } to { opacity:1;                             } }
        @keyframes scaleIn   { from { opacity:0; transform:scale(0.88);       } to { opacity:1; transform:scale(1);         } }
        @keyframes slideLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0);    } }
        @keyframes slideRight{ from { opacity:0; transform:translateX(40px);  } to { opacity:1; transform:translateX(0);    } }
        @keyframes float     { 0%,100%{ transform:translateY(0px); } 50%{ transform:translateY(-10px); } }
        @keyframes spin      { from{ transform:rotate(0deg); } to{ transform:rotate(360deg); } }
        @keyframes marquee   { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
        @keyframes pulse     { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
        @keyframes stampIn   { from{ opacity:0; transform:scale(1.4) rotate(-8deg); } to{ opacity:1; transform:scale(1) rotate(-8deg); } }

        .fade-up  { animation: fadeUp  0.7s ease forwards; }
        .fade-in  { animation: fadeIn  0.6s ease forwards; }

        .card-hover { transition: box-shadow 0.2s, transform 0.2s; }
        .card-hover:hover { box-shadow: 7px 7px 0px #000; transform: translate(-2px,-2px); }

        .btn-press { transition: box-shadow 0.15s, transform 0.15s; }
        .btn-press:hover { box-shadow: 2px 2px 0px #555; transform: translate(2px,2px); }

        .marquee-track { animation: marquee 22s linear infinite; display:flex; width:max-content; }
        .dot-float     { animation: float 3s ease-in-out infinite; }
        .spin-slow     { animation: spin 18s linear infinite; }
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; }
      `}</style>

      {/* ══════════════ HERO ══════════════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center min-h-screen overflow-hidden w-full px-4"
        style={{ background: "#fafafa" }}
      >
        {/* Parallax dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00000018 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
            transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
            transition: "transform 0.4s ease",
          }}
        />

        {/* Floating deco */}
        <div
          className="dot-float absolute top-24 left-8 w-10 h-10 border-2 border-black rounded-full opacity-20"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="dot-float absolute top-40 right-12 w-6 h-6 bg-black opacity-10 rotate-45"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="dot-float absolute bottom-32 left-16 text-3xl opacity-20"
          style={{ animationDelay: "1.5s" }}
        >
          ✦
        </div>
        <div
          className="dot-float absolute bottom-48 right-10 text-2xl opacity-15"
          style={{ animationDelay: "0.5s" }}
        >
          ⚡
        </div>
        <div className="spin-slow absolute top-16 right-16 w-20 h-20 border-2 border-dashed border-black opacity-10 rounded-full" />

        {/* Dev badge */}
        <div
          className="fade-up rounded-full border-2 border-black px-3 py-1.5 sm:px-5 sm:py-2 shadow-[3px_3px_0px_#000] bg-white mt-16 relative z-10"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          <p className="text-center text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] sm:tracking-[0.3em] uppercase text-gray-500">
            ⚙ V1 is live
          </p>
        </div>

        {/* Hero text */}
        <div className="text-center mt-10 flex flex-col items-center gap-4 max-w-2xl mx-auto px-4 relative z-10">
          <h1
            className="fade-up font-black tracking-tighter leading-none text-black"
            style={{
              fontSize: "clamp(3rem, 9vw, 6rem)",
              animationDelay: "0.25s",
              opacity: 0,
            }}
          >
            Track Your
            <br />
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontWeight: 900,
              }}
            >
              Watchlist
            </span>
          </h1>
          <h3
            className="fade-up font-serif italic text-gray-500 leading-snug"
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              animationDelay: "0.4s",
              opacity: 0,
            }}
          >
            The Smart Way ✦
          </h3>
          <svg
            className="fade-in my-1"
            width="100"
            height="10"
            viewBox="0 0 100 10"
            style={{ animationDelay: "0.55s", opacity: 0 }}
          >
            <polyline
              points="0,8 12,2 24,8 36,2 48,8 60,2 72,8 84,2 96,8"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className="fade-up text-gray-500 leading-relaxed"
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              animationDelay: "0.6s",
              opacity: 0,
            }}
          >
            Organise what you wish to watch, are currently watching,
            <br className="hidden sm:block" /> and have already completed.
          </p>
          <p
            className="fade-up font-mono font-semibold text-black"
            style={{
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              animationDelay: "0.72s",
              opacity: 0,
            }}
          >
            Simple. Manual. Yours. ヾ(≧▽≦*)o
          </p>
        </div>

        {/* CTAs */}
        <div
          className="fade-up flex flex-col sm:flex-row items-center gap-4 mt-8 relative z-10"
          style={{ animationDelay: "0.85s", opacity: 0 }}
        >
          <Link href="/signup">
            <button className="btn-press flex items-center gap-2 bg-black text-white text-base font-bold tracking-wide px-7 py-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#555]">
              Get Started <ArrowUpRight className="w-5 h-5" />
            </button>
          </Link>
          <button className="btn-press flex items-center gap-2 bg-white text-black text-base font-bold tracking-wide px-7 py-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
            <Play className="w-4 h-4 fill-black" /> See how it works
          </button>
        </div>

        {/* Mock UI */}
        <div
          className="fade-up relative mt-14 mx-4 px-4 z-10"
          style={{
            animationDelay: "1s",
            opacity: 0,
            maxWidth: 480,
            width: "100%",
          }}
        >
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-black opacity-30" />
              <div className="w-3 h-3 rounded-full bg-black opacity-30" />
              <div className="w-3 h-3 rounded-full bg-black opacity-30" />
              <span className="ml-auto text-xs font-mono text-gray-400">
                my watchlist
              </span>
            </div>
            {[
              { title: "Goblin (도깨비)", status: "✅ Completed", stars: 5 },
              { title: "Demon Slayer S4", status: "▶ Watching", stars: 4 },
              { title: "My Demon", status: "📌 Plan to Watch", stars: null },
            ].map((item, i) => (
              <div
                key={item.title}
                className="flex items-center justify-between py-2.5 border-b border-dashed border-gray-200 last:border-0"
                style={{
                  animation: "fadeUp 0.5s ease forwards",
                  animationDelay: `${1.1 + i * 0.15}s`,
                  opacity: 0,
                }}
              >
                <div>
                  <p className="text-sm font-bold text-black">{item.title}</p>
                  <p className="text-xs text-gray-400 font-mono">
                    {item.status}
                  </p>
                </div>
                {item.stars && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.stars }).map((_, s) => (
                      <Star key={s} className="w-3 h-3 fill-black text-black" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className="absolute -top-4 -right-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-center leading-tight border-2 border-black"
            style={{
              animation: "stampIn 0.6s ease forwards",
              animationDelay: "1.4s",
              opacity: 0,
              transform: "scale(1.4) rotate(-8deg)",
              fontSize: "0.45rem",
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: "0.05em",
            }}
          >
            FREE
            <br />
            FOREVER
          </div>
        </div>

        {/* Scroll cue
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ animation: "pulse 2s ease infinite" }}
        >
          <span className="text-xs font-mono text-gray-400 tracking-widest">
            SCROLL
          </span>
          <div className="w-px h-8 bg-gray-300" />
        </div> */}
      </section> 

      {/* ══════════════ MARQUEE ══════════════ */}
      <div className="border-y-2 border-black bg-black text-white py-3 overflow-hidden">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-8 px-8 whitespace-nowrap"
            >
              {[
                "🎌 Asian Dramas",
                "⚡ Anime Tracker",
                "📋 Watchlist Manager",
                "✦ Free Forever",
                "🎀 Kawaii Style",
                "📺 K-Drama Ready",
                "🗂 Curated Lists",
              ].map((t) => (
                <span
                  key={t}
                  className="text-sm font-mono tracking-widest uppercase font-bold"
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ FEATURES ══════════════ */}
      <section
        className="py-24 px-4 sm:px-8 bg-white"
        style={{ width: "100%" }}
        ref={features.ref}
      >
        <div
          className={features.inView ? "fade-up" : "opacity-0"}
          style={{
            animationDelay: "0s",
            textAlign: "center",
            marginBottom: "3.5rem",
          }}
        >
          <span className="inline-block font-mono text-xs tracking-[0.4em] uppercase bg-black text-white px-4 py-1.5 rounded-full mb-4">
            ✦ What&apos;s inside
          </span>
          <h2
            className="font-black tracking-tighter text-black leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            Features <span className="text-2xl align-middle">⚡</span>
          </h2>
          <svg
            className="mx-auto mt-3"
            width="120"
            height="10"
            viewBox="0 0 120 10"
          >
            <polyline
              points="0,8 12,2 24,8 36,2 48,8 60,2 72,8 84,2 96,8 108,2 120,8"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <ul className="flex flex-col md:flex-row items-stretch gap-6 w-full">
          {[
            {
              icon: <ClipboardList className="w-8 h-8" />,
              tag: "01",
              title: "Track your watchlist in 3 different categories",
              dot: "▲",
              delay: "0.1s",
            },
            {
              icon: <FolderOpen className="w-8 h-8" />,
              tag: "02",
              title:
                "Organize your viewing experience with customized curated lists",
              dot: "●",
              delay: "0.25s",
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              tag: "03",
              title:
                "Easy to use — just add your watchlist items and manage them",
              dot: "■",
              delay: "0.4s",
            },
          ].map(({ icon, tag, title, dot, delay }) => (
            <li key={tag} className="flex-1 group">
              <div
                className="card-hover relative bg-white p-7 rounded-2xl h-full flex flex-col gap-5 cursor-default border-2 border-black shadow-[4px_4px_0px_#000]"
                style={
                  features.inView
                    ? {
                        animation: "scaleIn 0.6s ease forwards",
                        animationDelay: delay,
                      }
                    : { opacity: 0 }
                }
              >
                <span className="absolute top-4 right-5 font-mono text-xs font-bold text-gray-200 tracking-widest">
                  {tag}
                </span>
                <div className="w-14 h-14 rounded-xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_#555]">
                  {icon}
                </div>
                <p className="font-bold text-base text-gray-900 leading-snug flex-1">
                  {title}
                </p>
                <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-200">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                    Kineq
                  </span>
                  <span className="text-black text-sm font-black group-hover:scale-125 transition-transform duration-200">
                    {dot}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section
        className="py-24 px-4 sm:px-8 bg-black text-white"
        style={{ width: "100%" }}
        ref={howIt.ref}
      >
        <div
          style={
            howIt.inView
              ? { animation: "fadeUp 0.6s ease forwards", opacity: 0 }
              : { opacity: 0 }
          }
          className="text-center mb-14"
        >
          <span className="inline-block font-mono text-xs tracking-[0.4em] uppercase border border-white px-4 py-1.5 rounded-full mb-4 text-gray-400">
            ✦ Get going fast
          </span>
          <h2
            className="font-black tracking-tighter leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            How It Works
          </h2>
        </div>

        <div className="w-full flex flex-col gap-5">
          {[
            {
              step: "01",
              icon: <BookOpen className="w-6 h-6" />,
              title: "Sign up for free",
              desc: "No credit card, no nonsense. Create your account in seconds.",
              delay: "0s",
            },
            {
              step: "02",
              icon: <ClipboardList className="w-6 h-6" />,
              title: "Add titles to your list",
              desc: "Search for any drama or anime and drop it into your watchlist.",
              delay: "0.15s",
            },
            {
              step: "03",
              icon: <FolderOpen className="w-6 h-6" />,
              title: "Categorize & organise",
              desc: "Move titles between Plan to Watch, Watching, and Completed.",
              delay: "0.3s",
            },
          ].map(({ step, icon, title, desc, delay }, i) => (
            <div
              key={step}
              className="flex items-start gap-5"
              style={
                howIt.inView
                  ? {
                      animation: `${i % 2 === 0 ? "slideLeft" : "slideRight"} 0.65s ease forwards`,
                      animationDelay: delay,
                      opacity: 0,
                    }
                  : { opacity: 0 }
              }
            >
              <div className="flex-shrink-0 w-14 h-14 bg-white text-black rounded-xl border-2 border-white shadow-[3px_3px_0px_#555] flex items-center justify-center">
                {icon}
              </div>
              <div className="border-2 border-white rounded-xl p-4 flex-1 hover:bg-white hover:text-black transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-gray-500 font-bold">
                    {step}
                  </span>
                  <p className="font-bold">{title}</p>
                </div>
                <p className="text-sm opacity-60 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section
        className="py-24 px-4 sm:px-8 bg-white"
        style={{ width: "100%" }}
        ref={faq.ref}
      >
        <div
          style={
            faq.inView
              ? { animation: "fadeUp 0.6s ease forwards", opacity: 0 }
              : { opacity: 0 }
          }
          className="text-center mb-14"
        >
          <span className="inline-block font-mono text-xs tracking-[0.4em] uppercase bg-black text-white px-4 py-1.5 rounded-full mb-4">
            ✦ Got questions?
          </span>
          <h2
            className="font-black tracking-tighter text-black leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            FAQ <span className="text-2xl align-middle">❓</span>
          </h2>
          <svg
            className="mx-auto mt-3"
            width="80"
            height="10"
            viewBox="0 0 80 10"
          >
            <polyline
              points="0,8 10,2 20,8 30,2 40,8 50,2 60,8 70,2 80,8"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="w-full flex flex-col gap-4">
          {[
            {
              q: "Is Kineq completely free?",
              a: "Yes — 100% free, forever. No hidden plans, no paywalls, no ads. Just your watchlist.",
              delay: "0.05s",
            },
            {
              q: "Do I need to create an account?",
              a: "You will need a quick signup to save your watchlist across devices, but it takes under 30 seconds with no credit card required.",
              delay: "0.15s",
            },
            {
              q: "What are the 3 watchlist categories?",
              a: "Plan to Watch (your queue), Watching (currently ongoing), and Completed (finished shows you can rate and archive).",
              delay: "0.25s",
            },
            {
              q: "Can I add both anime and K-dramas?",
              a: "Absolutely. Kineq supports any Asian drama or anime — K-dramas, C-dramas, J-dramas, anime series, movies, you name it.",
              delay: "0.35s",
            },
            {
              q: "Is there a mobile app?",
              a: "Not yet! The web app is fully responsive and works great on mobile. A dedicated app is on the roadmap.",
              delay: "0.45s",
            },
            {
              q: "Can I share my watchlist with friends?",
              a: "Sharing features are coming soon. For now your lists are private and personal — just the way you like it.",
              delay: "0.55s",
            },
          ].map(({ q, a, delay }) => (
            <FAQItem key={q} q={q} a={a} delay={delay} inView={faq.inView} />
          ))}
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section
        className="py-24 px-4 sm:px-8 bg-white relative overflow-hidden border-t-2 border-black"
        style={{ width: "100%" }}
        ref={cta.ref}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00000012 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="spin-slow absolute -bottom-16 -right-16 w-64 h-64 border-2 border-dashed border-black opacity-10 rounded-full" />

        <div
          className="relative text-center w-full"
          style={
            cta.inView
              ? { animation: "scaleIn 0.7s ease forwards", opacity: 0 }
              : { opacity: 0 }
          }
        >
          <div className="inline-block bg-black text-white font-mono text-xs tracking-[0.4em] uppercase px-4 py-1.5 rounded-full mb-6">
            ✦ Ready to start?
          </div>
          <h2
            className="font-black tracking-tighter text-black leading-tight mb-4"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
          >
            Ready to watch
            <br />
            <span className="font-serif italic">smarter?</span>
          </h2>
          <p
            className="text-gray-500 mb-8 leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)" }}
          >
            Join Kineq and finally have one tidy place
            <br className="hidden sm:block" /> for all your dramas and anime.
            Free. Always.
          </p>
          <Link href="/signup">
            <button className="btn-press flex items-center justify-center gap-2 bg-black text-white text-base font-bold tracking-wide px-8 py-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#555] mx-auto">
              Get Started — it&apos;s free <ArrowUpRight className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs font-mono text-gray-400">
            {["No credit card", "No ads", "No BS"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-black" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

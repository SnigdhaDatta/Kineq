"use client";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds. No credit card, no nonsense. Your personalised watchlist is ready instantly.",
    icon: "👤",
  },
  {
    number: "02",
    title: "Add Titles to Your List",
    description:
      "Add any drama, anime or show to your list and move it between Watchlist, Ongoing, or Completed.",
    icon: "📋",
  },
  {
    number: "03",
    title: "Organise Your Way",
    description:
      "Create custom folders inside Completed. Edit , Delete them at any time you want .",
    icon: "📁",
  },
  {
    number: "04",
    title: "Ask the AI Chatbot",
    description:
      "Get info on any title, find recommendations, or just ask what to watch next. Instant answers.",
    icon: "🤖",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 px-4">
      {/* Section label */}
      <div className="flex justify-center mb-4">
        <span className="font-mono text-xs tracking-[0.3em] uppercase border border-black rounded-full px-4 py-1.5 text-black">
          ✦ See it in action
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-center font-black text-4xl md:text-5xl tracking-tighter text-black mb-2">
        How It Works
      </h2>
      <svg className="mx-auto mb-12" width="80" height="10" viewBox="0 0 80 10">
        <polyline
          points="0,8 10,3 20,8 30,3 40,8 50,3 60,8 70,3 80,8"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        {/* ── Browser Mockup Video ── */}
        <div className="w-full flex justify-center">
          <div
            className="border-2 border-black rounded-2xl shadow-[8px_8px_0px_#000] overflow-hidden"
            style={{ width: "100%", maxWidth: 900 }}
          >
            {/* Browser chrome bar */}
            <div
              className="bg-[#f0f0f0] border-b-2 border-black px-4 py-3 flex items-center gap-3"
              style={{ width: "100%" }}
            >
              {/* Traffic lights */}
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d4a017]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
              </div>
              {/* Fake URL bar */}
              <div className="flex-1 bg-white border border-[#ccc] rounded-md px-3 py-1 font-mono text-xs text-gray-500 text-center truncate">
                kin-eq.snowpie.me/how-it-works
              </div>
              {/* Refresh icon */}
              <span className="font-mono text-xs text-gray-400 select-none shrink-0">
                ⟳
              </span>
            </div>
            {/* Video area */}
            <div
              className="relative bg-black rounded-b-2xl"
              style={{ width: "100%", background: "#000" }}
            >
              <div
                style={{
                  position: "relative",
                  paddingBottom: "calc(56.25%)",
                  height: 0,
                  width: "100%",
                }}
              >
                <iframe
                  src="https://demo.arcade.software/video/ZF6VTM5WPrqviTARvRj7?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true&autoplay=true"
                  frameBorder="0"
                  loading="lazy"
                  allowFullScreen
                  allow="clipboard-write; autoplay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    colorScheme: "light",
                  }}
                />
              </div>
              <div className="absolute top-3 right-3 bg-black text-white font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                Demo
              </div>
            </div>
          </div>
        </div>

        {/* ── Steps ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000] bg-white hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 cursor-default"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-gray-400 mt-1 shrink-0 tracking-widest">
                  {step.number}
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{step.icon}</span>
                    <h3 className="font-black text-base tracking-tight text-black">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-mono text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

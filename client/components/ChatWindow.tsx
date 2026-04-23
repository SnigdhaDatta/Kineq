"use client";
import { useState, useRef, useEffect, startTransition } from "react";
import { X, Send } from "lucide-react";
import tokenSet from "@/lib/tokenset";

type BotResult = {
  title: string;
  content: string;
  url: string;
};
type BotRaw = {
  answer?: string;
  results?: BotResult[];
};
type Message = {
  from: string;
  text: string;
  raw?: BotRaw;
};
export default function ChatWindow({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi! Search about anything related to films , series, Asian dramas, or anime from recommendations , reviews to other related information and more . I'm here to help you find your next favorite watch!",
    },
  ]);
  const [query, setQuery] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!query.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: query }]);
    setQuery("");
    setIsBotTyping(true);
    startTransition(async () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken || "",
          },
          body: JSON.stringify({ query }),
        });
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken && newAccessToken !== accessToken)
          tokenSet(newAccessToken);
        const data = await res.json();
        if (res.ok) {
          console.log("Chatbot response:", data);
          setMessages((msgs) => [
            ...msgs,
            { from: "bot", text: data.answer || "", raw: data },
          ]);
          setIsBotTyping(false);
        } else if (res.status === 404) {
          setMessages((msgs) => [
            ...msgs,
            {
              from: "bot",
              text:
                data.error ||
                "Sorry, Information is not available for this query.",
            },
          ]);
          setIsBotTyping(false);
        } else {
          setMessages((msgs) => [
            ...msgs,
            {
              from: "bot",
              text: "Please Login Again to continue using the chatbot.",
            },
          ]);
          setIsBotTyping(false);
        }
      } catch (error) {
        console.log("Chatbot error:", error);
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: "Sorry, something went wrong. Please try again.",
          },
        ]);
        setIsBotTyping(false);
      }
    });
  }

  return (
    <>
      <div
        className="fixed right-4 md:right-8 z-[9999] animate-slideUp"
        style={{
          width: "380px",
          maxWidth: "92vw", // Tablet ba Mobile e side e ektu jaiga thakbe
          maxHeight: "80dvh", // "dvh" mane Dynamic Viewport Height, mobile e keyboard khulleo thik thakbe
          bottom: "calc(90px + env(safe-area-inset-bottom, 0px))", // Button er upore box ta thakbe
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        <div className="w-full h-[60vh] md:h-[70vh] bg-white border-2 border-black rounded-2xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-black bg-black/90 rounded-t-2xl">
            <span className="text-white font-bold text-lg">
              Kineq Recommender
            </span>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-2 bg-white"
            style={{ minHeight: 180 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-xl border-2 ${msg.from === "user" ? "bg-black text-white border-black" : "bg-yellow-100 border-yellow-400 text-black"} max-w-[80%] text-sm whitespace-pre-line break-words overflow-hidden`}
                >
                  {msg.from === "bot" &&
                  msg.raw &&
                  Array.isArray(msg.raw.results) &&
                  msg.raw.results.length > 0 ? (
                    <div>
                      {msg.text && (
                        <div className="mb-2 flex-2">{msg.text}</div>
                      )}
                      <ul className="space-y-3">
                        {msg.raw.results.map((r: BotResult, idx: number) => (
                          <li key={idx}>
                            <div className="font-bold mb-1">👉{r.title}</div>
                            <div className="mb-1">{r.content}</div>
                            🔗
                            <a
                              href={
                                typeof r.url === "string" ? r.url : undefined
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline break-all"
                            >
                              {r.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl border-2 bg-yellow-100 border-yellow-400 text-black max-w-[80%] text-sm whitespace-pre-line animate-pulse">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mr-1 animate-bounce"></span>
                  <span className="inline-block w-2 h-2 bg-black rounded-full mr-1 animate-bounce delay-150"></span>
                  <span className="inline-block w-2 h-2 bg-black rounded-full animate-bounce delay-300"></span>
                  <span className="ml-2">Working</span>
                </div>
              </div>
            )}
          </div>
          <form
            className="flex items-center gap-2 border-t border-black px-3 py-2 bg-white rounded-b-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              className="flex-1 px-3 py-2 rounded-xl border-2 border-black focus:outline-none focus:border-yellow-400 text-black bg-white"
              placeholder="Ask for recommendations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-yellow-400 hover:text-black transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.35s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </>
  );
}

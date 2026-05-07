"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import tokenSet from "@/lib/tokenset";

export default function OngoingPublicPage() {
  const [name, setName] = useState("");
  const [ongoing, setOngoing] = useState<
    Array<{ _id: string; name: string; episode: number; coverImage?: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const { ongoingSharedId } = params;

  const fetchOngoing = useCallback(async () => {
    setLoading(true);
    setError("");
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/share/ongoing/${ongoingSharedId}`,
        {
          method: "GET",
          credentials: "include",
          headers: { Authorization: accessToken || "" },
        },
      );
      const newAccessToken = res.headers?.get("Authorization");
      if (newAccessToken && newAccessToken !== accessToken)
        tokenSet(newAccessToken);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch ongoing items");
        return;
      }
      // Support both array and object response for robustness
      if (Array.isArray(data)) {
        setOngoing(data);
        setName("");
      } else {
        setOngoing(data.data || []);
        setName(data.fullname?.split(" ")[0] || "");
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [router, ongoingSharedId]);

  useEffect(() => {
    fetchOngoing();
  }, [fetchOngoing]);

  return (
    <div className="w-full min-h-screen bg-white px-4 py-8">
      <div className="mb-8">
        <span className="inline-block font-mono text-xs tracking-[0.3em] uppercase bg-black text-white px-3 py-1 rounded-full mb-3">
          ✦ Ongoing
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-black leading-none">
          {name ? `${name}'s Ongoing List` : "Current Ongoing List"}
        </h1>
        <svg className="mt-2" width="60" height="8" viewBox="0 0 60 8">
          <polyline
            points="0,6 8,2 16,6 24,2 32,6 40,2 48,6 56,2"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Search bar — click redirects to login */}
      <div className="flex items-center gap-4 mb-8">
        {/* <div className="relative w-64">
          <input
            type="text"
            readOnly
            onFocus={() => router.push("/login")}
            onClick={() => router.push("/login")}
            className="w-full px-4 py-2 border-2 border-black rounded-xl font-mono text-sm text-black placeholder-gray-300 focus:outline-none cursor-pointer"
            placeholder="Search ongoing..."
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div> */}
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 font-mono text-sm mb-2">{error}</div>
      )}

      {/* Items */}
      {loading ? (
        <div className="text-center text-gray-500 font-mono">Loading...</div>
      ) : ongoing.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoing.map((item) => (
            <OngoingPublicCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-16">
          <div className="text-lg font-mono text-gray-500 text-center">
            Nothing ongoing right now.
          </div>
        </div>
      )}
    </div>
  );
}

function OngoingPublicCard({
  item,
}: {
  item: { _id: string; name: string; episode: number; coverImage?: string };
}) {
  return (
    <div className="border-2 border-black rounded-xl p-4 bg-white shadow-[4px_4px_0px_#000] flex flex-col gap-2">
      {item.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.coverImage}
          alt={item.name}
          className="w-full h-40 object-cover rounded-lg border border-black"
        />
      )}
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="font-black text-lg tracking-tight text-black leading-tight">
          {item.name}
        </span>
        <span className="font-mono text-sm text-gray-500">
          Episode: {item.episode}
        </span>
      </div>
    </div>
  );
}

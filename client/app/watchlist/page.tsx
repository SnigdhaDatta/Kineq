"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { WatchlistItem } from "./item";
import tokenSet from "@/lib/tokenset";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<
    Array<{ _id: string; name: string; coverImage?: string }>
  >([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    setError("");
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watchlist`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: accessToken || "" },
      });
      const newAccessToken = res.headers?.get("Authorization");
      if (newAccessToken && newAccessToken !== accessToken)tokenSet(newAccessToken);
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }        
        setError(data.error || "Failed to fetch watchlist items");
        return;
      }
      setWatchlist(data || []);
      setError("");
    } catch (err: unknown) {
      const msg = (err as Error).message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const filtered = watchlist.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-white px-4 py-8">
      {/* Add and Search Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow hover:bg-gray-800 transition-all"
          onClick={() => router.push("/watchlist/add")}
        >
          <Plus className="w-5 h-5" /> Add
        </button>
        <div className="relative w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black rounded-xl font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150"
            placeholder="Search watchlist..."
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="text-red-500 font-mono text-sm mb-2">{error}</div>
      )}

      {/* Watchlist Items or Empty State */}
      {loading ? (
        <div className="text-center text-gray-500 font-mono">Loading...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <WatchlistItem
              key={item._id}
              item={item}
              onRefresh={fetchWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-16">
          <button
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold border-2 border-black shadow hover:bg-gray-800 transition-all mb-4"
            onClick={() => router.push("/watchlist/add")}
          >
            <Plus className="w-5 h-5" /> Add
          </button>
          <div className="text-lg font-mono text-gray-500">
            Click to add your first movie/series in the watchlist
          </div>
        </div>
      )}
    </div>
  );
}

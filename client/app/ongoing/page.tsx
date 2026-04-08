"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { OngoingItem } from "./item";
import tokenSet from "@/lib/tokenset";
import RouteProtector from "@/middleware/routematcher";

export default function OngoingPage() {
  const [ongoing, setOngoing] = useState<
    Array<{ _id: string; name: string; episode: number; coverImage?: string }>
  >([]);
  const [folders, setFolders] = useState<Array<{ _id: string; name: string }>>(
    [],
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchFolders = useCallback(async () => {
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/completed`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: accessToken || "" },
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        if (res.status === 404) {
          setFolders([]);
          return;
        }
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken && newAccessToken !== accessToken)
          tokenSet(newAccessToken);
        return;
      }
      setFolders(data || []);
    } catch {
      setFolders([]);
    }
  }, [router]);

  const fetchOngoing = useCallback(async () => {
    setLoading(true);
    setError("");
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ongoing`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: accessToken || "" },
      });
      const newAccessToken = res.headers?.get("Authorization");
      if (newAccessToken && newAccessToken !== accessToken)
        tokenSet(newAccessToken);
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        setError(data.error || "Failed to fetch ongoing items");
        return;
      }
      setOngoing(data || []);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOngoing();
    fetchFolders();
  }, [fetchOngoing, fetchFolders]);

  const filtered = ongoing.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-white px-4 py-8">
      <RouteProtector />
      {/* Add and Search Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow hover:bg-gray-800 transition-all"
          onClick={() => router.push("/ongoing/add")}
        >
          <Plus className="w-5 h-5" /> Add
        </button>
        <div className="relative w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black rounded-xl font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150"
            placeholder="Search ongoing..."
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="text-red-500 font-mono text-sm mb-2">{error}</div>
      )}

      {/* Ongoing Items or Empty State */}
      {loading ? (
        <div className="text-center text-gray-500 font-mono">Loading...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <OngoingItem
              key={item._id}
              item={item}
              folders={folders}
              onRefresh={fetchOngoing}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-16">
          <button
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold border-2 border-black shadow hover:bg-gray-800 transition-all mb-4"
            onClick={() => router.push("/ongoing/add")}
          >
            <Plus className="w-5 h-5" /> Add
          </button>
          <div className="text-lg font-mono text-gray-500">
            Click to add your first ongoing item
          </div>
        </div>
      )}
    </div>
  );
}

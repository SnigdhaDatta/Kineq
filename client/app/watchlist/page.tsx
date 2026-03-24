"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import tokenSet from "@/lib/tokenset";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<
    Array<{ _id: string; name: string; coverImage?: string }>
  >([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  async function fetchWatchlist() {
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
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken) tokenSet(newAccessToken); // Update token in localStorage if a new one is provided
        setError(data.error || "Failed to fetch watchlist items");
        setMessage("");
        return;
      }
      setWatchlist(data || []);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // PATCH request to update a watchlist item by _id
  async function handleEdit(id: string, name: string) {
    setError("");
    setMessage("");
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/watchlist/${id}`,
        {
          method: "PATCH",
          credentials: "include", //
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken || "",
          },
          body: JSON.stringify({ name }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken) tokenSet(newAccessToken); // Update token in localStorage if a new one is provided
        setError(data.error || "Failed to update item");
        setMessage("");
        return;
      }
      setError("");
      setMessage(data.message);
      fetchWatchlist();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  // DELETE request to remove a watchlist item by _id
  async function handleDelete(id: string) {
    setError("");
    setMessage("");
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/watchlist/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: accessToken || "",
          },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken) tokenSet(newAccessToken); // Update token in localStorage if a new one is provided
        setError(data.error || "Failed to delete item");
        setMessage("");
        return;
      }
      setError("");
      setMessage(data.message);
      fetchWatchlist();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  // Filtered watchlist by search
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
      {message && (
        <div className="text-green-600 font-mono text-sm mb-2">{message}</div>
      )}
      {error && (
        <div className="text-red-500 font-mono text-sm mb-2">{error}</div>
      )}

      {/* Watchlist Items or Empty State */}
      {loading ? (
        <div className="text-center text-gray-500 font-mono">Loading...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item._id}
              className="border-2 border-black rounded-xl p-4 bg-white shadow flex flex-col gap-2 relative"
            >
              <div className="flex items-center justify-between">
                {editingIndex === idx ? (
                  <div className="flex flex-wrap items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="font-bold text-lg border-b-2 border-black outline-none px-1 bg-white flex-1"
                      autoFocus
                    />
                    <button
                      className="rounded-full p-1 bg-white flex items-center justify-center"
                      onClick={() => {
                        if (editValue.trim() && editValue !== item.name) {
                          handleEdit(item._id, editValue);
                        }
                        setEditingIndex(null);
                      }}
                      aria-label="Save"
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </button>
                    <button
                      className="rounded-full p-1 bg-white flex items-center justify-center"
                      onClick={() => setEditingIndex(null)}
                      aria-label="Cancel"
                    >
                      <XCircle className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-lg">{item.name}</span>
                    <div className="relative">
                      <button
                        className="ml-2 text-gray-500 hover:text-black"
                        onClick={() =>
                          setOpenMenuId((prev) =>
                            prev === item._id ? null : item._id,
                          )
                        }
                        aria-label="Options"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openMenuId === item._id && editingIndex !== idx && (
                        <div className="absolute right-0 mt-1 w-24 bg-white border-2 border-black rounded-lg shadow z-20">
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                            onClick={() => {
                              setEditingIndex(idx);
                              setEditValue(item.name);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              handleDelete(item._id);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {/* Removed extra Pencil icon */}
              </div>
              {item.coverImage && (
                <Image
                  width={400}
                  height={300}
                  src={item.coverImage}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg border"
                />
              )}
            </div>
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

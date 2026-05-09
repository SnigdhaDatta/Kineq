"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { CompletedItem } from "./item";
import NotificationBar, {
  type NotificationType,
} from "@/components/notification-bar";
import tokenSet from "@/lib/tokenset";
import RouteProtector from "@/middleware/routematcher";

export default function CompletedPage() {
  const [folders, setFolders] = useState<
    { _id: string; name: string; coverImage?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    open: boolean;
    type: NotificationType;
    message: string;
  }>({ open: false, type: "info", message: "" });
  const [search, setSearch] = useState("");
  const router = useRouter();

  function notify(type: NotificationType, message: string) {
    setToast({ open: true, type, message });
  }

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/completed`, {
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
          localStorage.removeItem("kineq");
          router.push("/login");
          return;
        }
        setError(data.error || "Failed to fetch folders");
        return;
      }
      setFolders(data);
    } catch (err: unknown) {
      setError(
        (err instanceof Error && err.message) || "Error fetching folders",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const filtered = folders.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-white px-4 py-8">
      <NotificationBar
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      <RouteProtector />
      {/* Add Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow hover:bg-gray-800 transition-all"
          onClick={() => router.push("/completed/add")}
        >
          <Plus className="w-5 h-5" /> Folder
        </button>
        <div className="relative w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black rounded-xl font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150"
            placeholder="Search folders..."
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        {/* Share button removed: sharing is available on the full list page */}
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="text-red-500 font-mono text-sm mb-2">{error}</div>
      )}

      {/* Completed Folders or Empty State */}
      {loading ? (
        <div className="text-center text-gray-500 font-mono">Loading...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((folder) => (
            <CompletedItem
              key={folder._id}
              folder={folder}
              onRefresh={fetchFolders}
              notify={notify}
              onItemChanged={(id, updated) => {
                if (updated) {
                  setFolders((prev) =>
                    prev.map((i) => (i._id === id ? { ...i, ...updated } : i)),
                  );
                } else {
                  setFolders((prev) => prev.filter((i) => i._id !== id));
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-16">
          <button
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold border-2 border-black shadow hover:bg-gray-800 transition-all mb-4"
            onClick={() => router.push("/completed/add")}
          >
            <Plus className="w-5 h-5" /> Folder
          </button>
          <div className="text-lg font-mono text-gray-500 text-center">
            Click to add your first completed folder
          </div>
        </div>
      )}
    </div>
  );
}

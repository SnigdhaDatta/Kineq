"use client";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Share2,
} from "lucide-react";
import ShareModal from "@/components/ShareModal";
import RouteProtector from "@/middleware/routematcher";
import tokenSet from "@/lib/tokenset";
import NotificationBar, {
  type NotificationType,
} from "@/components/notification-bar";

interface Drama {
  _id: string;
  name: string;
  coverImageUrl?: string;
}

export default function CompletedFolderPage() {
  const [shareOpen, setShareOpen] = useState(false);
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    type: NotificationType;
    message: string;
  }>({ open: false, type: "info", message: "" });
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  // Ensure folderId and folderDisplayName are always strings
  const folderId = Array.isArray(params?.fullname)
    ? params.fullname[0]
    : params?.fullname || "";
  const folderDisplayNameRaw = searchParams.get("name");
  const folderDisplayName = Array.isArray(folderDisplayNameRaw)
    ? folderDisplayNameRaw[0]
    : folderDisplayNameRaw || "";

  const deferredSearch = useDeferredValue(search);

  function getAccessToken() {
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    return appData.accesstoken;
  }

  // Fetch dramas using folderId
  const fetchDramas = useCallback(async () => {
    if (!folderId) return;
    setLoading(true);
    setError("");
    const accessToken = getAccessToken();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/completed/${folderId}/contents`,
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
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        setError(data.error || data.message);
        setMessage("");
        setDramas([]);
        return;
      }
      setDramas(
        Array.isArray(data)
          ? data.filter((item) => item && typeof item.name === "string")
          : [],
      );
    } catch (err: unknown) {
      setError((err as Error).message);
      setDramas([]);
    } finally {
      setLoading(false);
    }
  }, [folderId, router]);

  useEffect(() => {
    fetchDramas();
  }, [fetchDramas]);

  // PATCH request to update a drama by _id
  async function handleEdit(id: string, newName: string) {
    // Only show notification, not error/message on main screen
    // Optimistic UI update
    setDramas((prev) =>
      prev.map((d) => (d._id === id ? { ...d, name: newName } : d)),
    );
    const accessToken = getAccessToken();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/completed/${folderId}/contents/${decodeURIComponent(id)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken || "",
          },
          body: JSON.stringify({ name: newName, coverImageUrl: "" }),
        },
      );
      const newAccessToken = res.headers?.get("Authorization");
      if (newAccessToken && newAccessToken !== accessToken)
        tokenSet(newAccessToken);
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        setToast({
          open: true,
          type: "error",
          message: data.error || data.message,
        });
        // Revert optimistic update
        fetchDramas();
        return;
      }
      setToast({
        open: true,
        type: "success",
        message: data.message || "Updated successfully",
      });
    } catch (err: unknown) {
      setToast({ open: true, type: "error", message: (err as Error).message });
      // Revert optimistic update
      fetchDramas();
    }
  }

  // DELETE request to remove a drama by _id
  async function handleDelete(id: string) {
    // Only show notification, not error/message on main screen
    // Optimistic UI update
    setDramas((prev) => prev.filter((d) => d._id !== id));
    const accessToken = getAccessToken();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/completed/${folderId}/contents/${decodeURIComponent(id)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: accessToken || "",
          },
        },
      );
      const newAccessToken = res.headers?.get("Authorization");
      if (newAccessToken && newAccessToken !== accessToken)
        tokenSet(newAccessToken);
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        setToast({
          open: true,
          type: "error",
          message: data.error || data.message,
        });
        // Revert optimistic update
        fetchDramas();
        return;
      }
      setToast({
        open: true,
        type: "success",
        message: data.message || "Deleted successfully",
      });
    } catch (err: unknown) {
      setToast({ open: true, type: "error", message: (err as Error).message });
      // Revert optimistic update
      fetchDramas();
    }
  }

  // Filtered dramas by search
  const normalizedSearch = deferredSearch.toLowerCase();
  const filtered = useMemo(
    () =>
      dramas.filter(
        (item) =>
          typeof item?.name === "string" &&
          item.name.toLowerCase().includes(normalizedSearch),
      ),
    [dramas, normalizedSearch],
  );

  //create link for sharing contents inside folder
  const createShareLink = useCallback(async () => {
    const accessToken = getAccessToken();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/completed/${folderId}/contents/getLink`,
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
        if (data.error === "REFRESH_EXPIRED") {
          router.push("/login");
          return;
        }
        setError(data.error || "Failed to fetch completed items");
        return;
      }
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_SITE_URL ||
            "https://your-production-link.com"
          : "http://localhost:3000";
      setLink(
        `${baseUrl}/share/completed/${folderId}/${data.completedSharedId}`,
      );
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [router, folderId]);

  return (
    <div className="w-full min-h-screen bg-white px-4 py-8">
      <NotificationBar
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      <RouteProtector />
      {/* Folder Name Heading */}
      <div className="mb-8 sticky top-0 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 break-all">
          {folderDisplayName}
        </h1>
      </div>
      {/* Add, Search, and Share Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow hover:bg-gray-800 transition-all"
          onClick={() =>
            folderId &&
            router.push(
              `/completed/${folderId}/add?name=${encodeURIComponent(folderDisplayName)}`,
            )
          }
        >
          <Plus className="w-5 h-5" /> Add
        </button>
        <div className="relative w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black rounded-xl font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150"
            placeholder={`Search ${folderDisplayName}...`}
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <button
          className="flex items-center justify-center bg-white text-black p-2 rounded-full border-2 border-black shadow hover:bg-gray-100 transition-all"
          style={{ width: 36, height: 36 }}
          onClick={async () => {
            await createShareLink();
            setShareOpen(true);
          }}
          title="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <ShareModal
          url={
            link || (typeof window !== "undefined" ? window.location.href : "")
          }
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      </div>

      {/* Feedback messages (only for fetch errors, not edit/delete) */}
      {error && (
        <div className="text-red-500 font-mono text-sm mb-2">{error}</div>
      )}

      {/* Dramas or Empty State */}
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
              </div>
              {item.coverImageUrl && (
                <Image
                  width={400}
                  height={300}
                  src={item.coverImageUrl}
                  alt={item.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            onClick={() =>
              folderId &&
              router.push(
                `/completed/${encodeURIComponent(folderId)}/add?name=${encodeURIComponent(folderDisplayName)}`,
              )
            }
          >
            <Plus className="w-5 h-5" /> Add
          </button>
          <div className="text-lg font-mono text-gray-500 text-center">
            Click to add your first completed movie/series in this folder
          </div>
        </div>
      )}
    </div>
  );
}

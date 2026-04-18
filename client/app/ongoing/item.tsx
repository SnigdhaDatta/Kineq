"use client";
import { useState, useTransition } from "react";
import {
  MoreVertical,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import tokenSet from "@/lib/tokenset";
import { type NotificationType } from "@/components/notification-bar";

interface OngoingItemProps {
  item: { _id: string; name: string; episode: number; coverImage?: string };
  folders: Array<{ _id: string; name: string }>;
  onRefresh: () => void;
  notify: (type: NotificationType, message: string) => void;
  onItemChanged?: (
    id: string,
    updated?: { name?: string; episode?: number },
  ) => void;
}

export function OngoingItem({
  item,
  folders,
  onRefresh,
  notify,
  onItemChanged,
}: OngoingItemProps) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editEpisode, setEditEpisode] = useState(item.episode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  async function handleEdit() {
    if (
      !editName.trim() ||
      (editName === item.name && editEpisode === item.episode)
    ) {
      setEditing(false);
      return;
    }

    startTransition(async () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      try {
        // Optimistic UI update
        if (onItemChanged) {
          onItemChanged(item._id, { name: editName, episode: editEpisode });
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ongoing/${item._id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken || "",
            },
            body: JSON.stringify({ name: editName, episode: editEpisode }),
          },
        );
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken && newAccessToken !== accessToken)
          tokenSet(newAccessToken);
        const data = await res.json();
        if (!res.ok) {
          if (data.error === "REFRESH_EXPIRED") {
            window.location.href = "/login";
            notify("error", "Session expired. Please log in again.");
            return;
          }
          notify("error", data.error || "Failed to update");
          return;
        }
        setEditing(false);
        setMenuOpen(false);
        notify("success", data.message || "Updated successfully");
        onRefresh();
      } catch (err) {
        notify("error", "Something went wrong while updating");
        console.error(err);
      }
    });
  }

  async function handleDelete() {
    startTransition(async () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      try {
        // Optimistic UI update
        if (onItemChanged) {
          onItemChanged(item._id, undefined);
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ongoing/${item._id}`,
          {
            method: "DELETE",
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
            window.location.href = "/login";
            notify("error", "Session expired. Please log in again.");
            return;
          }
          notify("error", data.error || "Failed to delete");
          return;
        }
        setMenuOpen(false);
        notify("success", data.message || "Deleted successfully");
        onRefresh();
        //onRefresh();
      } catch (err) {
        notify("error", "Something went wrong while deleting");
        console.error(err);
      }
    });
  }

  async function handleMoveToCompleted(folderId: string) {
    if (!folderId) return;
    startTransition(async () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      try {
        // Optimistic UI update (remove from ongoing)
        if (onItemChanged) {
          onItemChanged(item._id, undefined);
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ongoing/${item._id}/${folderId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
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
            window.location.href = "/login";
            notify("error", "Session expired. Please log in again.");
            return;
          }
          notify("error", data.error || "Failed to move item");
          return;
        }
        setMenuOpen(false);
        setShowFolderPicker(false);
        notify("success", data.message || "Moved to completed");
        onRefresh();
        //onRefresh();
      } catch (err) {
        notify("error", "Something went wrong while moving item");
        console.error(err);
      }
    });
  }

  return (
    <div className="border-2 border-black rounded-xl p-4 bg-white shadow flex flex-col gap-2 relative">
      <div className="flex items-center justify-between w-full">
        {editing ? (
          <div className="flex flex-wrap items-center gap-2 w-full">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="font-bold text-lg border-b-2 border-black outline-none px-1 bg-white flex-1"
              disabled={isPending}
            />
            <input
              type="number"
              value={editEpisode}
              onChange={(e) => setEditEpisode(parseInt(e.target.value) || 1)}
              className="font-bold text-sm border-b-2 border-black outline-none px-1 bg-white w-16"
              disabled={isPending}
            />
            <button
              className="rounded-full p-1 bg-white flex items-center justify-center disabled:opacity-50"
              onClick={handleEdit}
              disabled={isPending}
              aria-label="Save"
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </button>
            <button
              className="rounded-full p-1 bg-white flex items-center justify-center disabled:opacity-50"
              onClick={() => {
                setEditing(false);
                setEditName(item.name);
                setEditEpisode(item.episode);
              }}
              disabled={isPending}
              aria-label="Cancel"
            >
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="font-bold text-lg">{item.name}</span>
                <p className="text-sm text-gray-500">Episode: {item.episode}</p>
              </div>
              <div className="relative flex-shrink-0">
                <button
                  className="ml-2 text-gray-500 hover:text-black disabled:opacity-50"
                  onClick={() => {
                    setMenuOpen((v) => {
                      const next = !v;
                      if (!next) setShowFolderPicker(false);
                      return next;
                    });
                  }}
                  disabled={isPending}
                  aria-label="Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white border-2 border-black rounded-lg shadow z-20 p-2 space-y-2">
                    <button
                      className="w-full text-left px-2 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 rounded"
                      onClick={() => {
                        setEditing(true);
                        setMenuOpen(false);
                        setShowFolderPicker(false);
                      }}
                      disabled={isPending}
                    >
                      Edit
                    </button>
                    <button
                      className="w-full text-left px-2 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 rounded flex items-center justify-between"
                      onClick={() => setShowFolderPicker((v) => !v)}
                      disabled={isPending || folders.length === 0}
                    >
                      <span>Move to completed</span>
                      {showFolderPicker && folders.length > 0 ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>
                    {showFolderPicker && folders.length > 0 && (
                      <div className="pl-4 space-y-1">
                        <p className="text-xs font-mono text-gray-600 mb-2">
                          Select folder:
                        </p>
                        <div className="max-h-10 overflow-y-auto space-y-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {folders.map((folder) => (
                            <button
                              key={folder._id}
                              className="w-full text-left px-2 py-2 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
                              onClick={() => handleMoveToCompleted(folder._id)}
                              disabled={isPending}
                            >
                              {folder.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 rounded"
                      onClick={handleDelete}
                      disabled={isPending}
                    >
                      Delete
                    </button>
                    {folders.length === 0 && (
                      <p className="text-xs text-gray-500 px-1">
                        Create a completed folder first.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
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
  );
}

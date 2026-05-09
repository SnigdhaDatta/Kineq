"use client";
import { useState, useTransition } from "react";
import { MoreVertical, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import tokenSet from "@/lib/tokenset";
import { type NotificationType } from "@/components/notification-bar";

interface WatchlistItemProps {
  item: { _id: string; name: string; coverImage?: string };
  onItemChanged?: (id: string, updated?: { name?: string }) => void;
  notify: (type: NotificationType, message: string) => void;
}

export default function WatchlistItem({
  item,
  onItemChanged,
  notify,
}: WatchlistItemProps) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleEdit() {
    if (!editValue.trim() || editValue === item.name) {
      setEditing(false);
      return;
    }

    startTransition(async () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/watchlist/${item._id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken || "",
            },
            body: JSON.stringify({ name: editValue }),
          },
        );
        const data = await res.json();
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken && newAccessToken !== accessToken)
          tokenSet(newAccessToken);
        if (!res.ok) {
          if (data.error === "REFRESH_EXPIRED") {
            localStorage.removeItem("kineq");
            window.location.href = "/login";
            notify("error", "Session expired. Please log in again.");
            return;
          }
          notify("error", data.error || "Failed to update");
          return;
        }
        setEditing(false);
        setMenuOpen(false);
        notify("success", data.message || "Watchlist item updated");
        if (onItemChanged) onItemChanged(item._id, { name: editValue });
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/watchlist/${item._id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken || "",
            },
          },
        );
        const data = await res.json();
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken && newAccessToken !== accessToken)
          tokenSet(newAccessToken);
        if (!res.ok) {
          if (data.error === "REFRESH_EXPIRED") {
            localStorage.removeItem("kineq");
            window.location.href = "/login";
            notify("error", "Session expired. Please log in again.");
            return;
          }
          notify("error", data.error || "Failed to delete");
          return;
        }
        setMenuOpen(false);
        notify("success", data.message || "Removed from watchlist");
        if (onItemChanged) onItemChanged(item._id);
      } catch (err) {
        notify("error", "Something went wrong while deleting");
        console.error(err);
      }
    });
  }

  async function handleMoveToOngoing() {
    startTransition(async () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/watchlist/${item._id}/move`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken || "",
            },
          },
        );
        const data = await res.json();
        const newAccessToken = res.headers?.get("Authorization");
        if (newAccessToken && newAccessToken !== accessToken)
          tokenSet(newAccessToken);
        if (!res.ok) {
          if (data.error === "REFRESH_EXPIRED") {
            localStorage.removeItem("kineq");
            window.location.href = "/login";
            notify("error", "Session expired. Please log in again.");
            return;
          }
          notify("error", data.error || "Failed to move item");
          return;
        }
        setMenuOpen(false);
        notify("success", "Moved to ongoing");
        if (onItemChanged) onItemChanged(item._id);
      } catch (err) {
        notify("error", "Something went wrong while moving item");
        console.error(err);
      }
    });
  }

  return (
    <div className="border-2 border-black rounded-xl p-4 bg-white shadow flex flex-col gap-2 relative">
      <div className="flex items-center justify-between">
        {editing ? (
          <div className="flex flex-wrap items-center gap-2 w-full">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="font-bold text-lg border-b-2 border-black outline-none px-1 bg-white flex-1"
              autoFocus
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
                setEditValue(item.name);
              }}
              disabled={isPending}
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
                className="ml-2 text-gray-500 hover:text-black disabled:opacity-50"
                onClick={() => setMenuOpen((v) => !v)}
                disabled={isPending}
                aria-label="Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border-2 border-black rounded-lg shadow z-20">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                    disabled={isPending}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                    onClick={handleMoveToOngoing}
                    disabled={isPending}
                  >
                    Add to ongoing
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </div>
              )}
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

"use client";
import { useState, useTransition } from "react";
import { Folder, MoreVertical, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import tokenSet from "@/lib/tokenset";

import { type NotificationType } from "@/components/notification-bar";

interface CompletedItemProps {
  folder: { _id: string; name: string; coverImage?: string };
  onRefresh: () => void;
  notify: (type: NotificationType, message: string) => void;
  onItemChanged?: (id: string, updated?: { name?: string }) => void;
}

export function CompletedItem({
  folder,
  onRefresh,
  notify,
  onItemChanged,
}: CompletedItemProps) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function handleEdit() {
    if (!editName.trim() || editName === folder.name) {
      setEditing(false);
      return;
    }

    startTransition(async () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      try {
        // Optimistic UI update
        if (onItemChanged) {
          onItemChanged(folder._id, { name: editName });
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/completed/${folder._id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken || "",
            },
            body: JSON.stringify({ name: editName, coverImageUrl: "" }),
          },
        );
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
          notify("error", data.error || "Failed to update");
          return;
        }
        setEditing(false);
        notify("success", "Folder updated");
        onRefresh();
      } catch (err) {
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
          onItemChanged(folder._id, undefined);
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/completed/${folder._id}`,
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
            localStorage.removeItem("kineq");
            router.push("/login");
            return;
          }
          notify("error", data.error || "Failed to delete");
          return;
        }
        notify("success", `${data.message}` || "Folder and its items deleted successfully");
        onRefresh();
      } catch (err) {
        console.error(err);
      }
    });
  }

  return (
    <div className="border-2 border-black rounded-xl p-4 bg-white shadow flex flex-col gap-2 relative group cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between gap-2">
        {folder.coverImage ? (
          <Image
            width={40}
            height={40}
            src={folder.coverImage}
            alt={folder.name}
            className="w-10 h-10 object-cover rounded border mr-2"
          />
        ) : (
          <Folder
            className="w-8 h-8 text-gray-400 mr-2"
            onClick={() =>
              router.push(
                `/completed/${folder._id}/?name=${encodeURIComponent(folder.name)}`,
              )
            }
          />
        )}
        <div className="flex-1">
          {editing ? (
            <input
              className="font-bold text-lg border-b-2 border-black outline-none px-1 bg-white w-full"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              disabled={isPending}
            />
          ) : (
            <span
              className="font-bold text-lg break-all block"
              onClick={() =>
                router.push(
                  `/completed/${folder._id}/?name=${encodeURIComponent(folder.name)}`,
                )
              }
            >
              {folder.name}
            </span>
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          {editing ? (
            <>
              <button
                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                onClick={handleEdit}
                disabled={isPending}
                title="Save"
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
              <button
                className="text-gray-500 hover:text-black disabled:opacity-50"
                onClick={() => {
                  setEditing(false);
                  setEditName(folder.name);
                }}
                disabled={isPending}
                title="Cancel"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </>
          ) : (
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
                <div className="absolute right-0 mt-1 w-24 bg-white border-2 border-black rounded-lg shadow z-20">
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
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

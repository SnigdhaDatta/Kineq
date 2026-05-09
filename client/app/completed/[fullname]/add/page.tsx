"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import tokenSet from "@/lib/tokenset";
import RouteProtector from "@/middleware/routematcher";

export default function AddCompletedDramaPage() {
  const [name, setName] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const folderId = Array.isArray(params?.fullname)
    ? params.fullname[0]
    : params?.fullname || "";

  const folderNameRaw = searchParams.get("name");
  const folderName = Array.isArray(folderNameRaw)
    ? folderNameRaw[0]
    : folderNameRaw || "";

  const returnPath = folderId
    ? `/completed/${encodeURIComponent(folderId)}?name=${encodeURIComponent(folderName)}`
    : "/completed";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!folderId) {
      setError("Folder id is missing");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/completed/${folderId}/contents`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken || "",
          },
          body: JSON.stringify({ name, coverImageUrl }),
        },
      );
      const newAccessToken = res.headers?.get("Authorization");
      if (newAccessToken && newAccessToken !== accessToken) tokenSet(newAccessToken);
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "REFRESH_EXPIRED") {
          localStorage.removeItem("kineq");
          router.push("/login");
          return;
        }
        setError(data.error || "Failed to add drama");
        return;
      }

      setMessage(data.message || "Drama added successfully!");
      setName("");
      setCoverImageUrl("");
      setTimeout(() => {
        router.push(returnPath);
      }, 900);
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong");
    }
  }

  return (
    <div className="w-full min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <RouteProtector />
      <button
        className="flex items-center gap-2 text-black px-4 py-2 rounded-xl font-bold border-2 border-black shadow hover:bg-gray-100 transition-all mb-8"
        onClick={() => router.push(returnPath)}
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <form
        className="w-full max-w-md bg-white border-2 border-black rounded-xl p-6 shadow-2xl flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-0">
          Add to {folderName ? folderName : "Completed Folder"}
        </h2>

        <svg width="60" height="8" viewBox="0 0 60 8" className="-mt-2">
          <polyline
            points="0,6 8,2 16,6 24,2 32,6 40,2 48,6 56,2"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {message && (
          <div className="text-green-600 font-mono text-sm">{message}</div>
        )}
        {error && <div className="text-red-500 font-mono text-sm">{error}</div>}

        <label className="font-mono font-bold">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border-2 border-black rounded-xl font-mono text-sm text-black placeholder-gray-300 focus:outline-none"
          placeholder="Drama/Series Name"
          required
        />

        {/*
        <label className="font-mono font-bold">Cover Image URL</label>
        <input
          type="text"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="px-4 py-2 border-2 border-black rounded-xl font-mono text-sm text-black placeholder-gray-300 focus:outline-none"
          placeholder="Image URL (optional)"
        />
        */}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#555] hover:shadow-[2px_2px_0px_#555] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
        >
          Add
        </button>
      </form>
    </div>
  );
}

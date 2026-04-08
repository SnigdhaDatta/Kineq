"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import tokenSet from "@/lib/tokenset";
import RouteProtector from "@/middleware/routematcher";

export default function AddWatchlistPage() {
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken = appData.accesstoken;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watchlist`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken || "",
      },
      body: JSON.stringify({ name, coverImage }),
    });
    if (!res.ok) {
      const data = await res.json();
      if (data.error === "REFRESH_EXPIRED") {
        router.push("/login");
        return;
      }
      const newAccessToken = res.headers?.get("Authorization");
      if (newAccessToken) tokenSet(newAccessToken); // Update token in localStorage if a new one is provided
      setError(data.error || "Failed to add to watchlist");
      return;
    }
    setSuccess("Added to watchlist successfully!");
    setTimeout(() => {
      router.push("/watchlist");
    }, 1500); // Show message for 1.2 seconds before redirect
  }

  return (
    <div className="w-full min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <RouteProtector />
      <button
        className="flex items-center gap-2 text-black px-4 py-2 rounded-xl font-bold border-2 border-black shadow hover:bg-gray-100 transition-all mb-8"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border-2 border-black rounded-xl p-6 shadow-2xl flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-2">Add to Watchlist</h2>
        {success && (
          <div className="text-green-600 font-mono text-sm">{success}</div>
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
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
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

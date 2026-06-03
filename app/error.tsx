"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
      <div className="text-center space-y-4 px-6">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-white/50 max-w-md">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="mt-4 px-6 py-2 bg-[#00ff87] text-black rounded-xl font-bold hover:bg-[#00e87a] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

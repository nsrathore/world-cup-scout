import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
      <div className="text-center space-y-4 px-6">
        <div className="text-6xl">🏟️</div>
        <h2 className="text-2xl font-bold">Page not found</h2>
        <p className="text-white/50">
          That matchup or page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-[#00ff87] text-black rounded-xl font-bold hover:bg-[#00e87a] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

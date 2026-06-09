import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-medium text-ink">404</h1>
        <p className="mt-3 text-sm text-sub">That page does not exist.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-ink px-4 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

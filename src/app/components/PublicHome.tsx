import Link from "next/link";

export default function PublicHome() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-[16px] font-medium tracking-tight">
          Memora
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#E8E8E8] bg-white px-4 text-[13px] font-medium hover:bg-[#F5F5F5] transition-all duration-200"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#1A1A1A] px-4 text-[13px] font-medium text-white hover:opacity-90 transition-all duration-200"
          >
            Register
          </Link>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center px-4 py-10">
        <div className="grid w-full items-center gap-10 md:grid-cols-[1fr_440px]">
          <div className="max-w-2xl">
            <p className="mb-4 text-[12px] uppercase tracking-[0.2em] text-[#888]">
              Personal memory workspace
            </p>
            <h1 className="text-[44px] font-medium leading-[1.05] tracking-normal md:text-[58px]">
              Your decisions, memories, and projects in one place.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#666]">
              Sign in to use Memora. Create an account manually with email and password, or continue
              with Google.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#1A1A1A] px-5 text-[14px] font-medium text-white hover:opacity-90 transition-all duration-200"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#E8E8E8] bg-white px-5 text-[14px] font-medium hover:bg-[#F5F5F5] transition-all duration-200"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#E8E8E8] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-medium">Memora preview</p>
              <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] text-[#3730A3]">
                Locked
              </span>
            </div>
            <div className="space-y-3">
              {[
                "Summarize my week",
                "Remember my project decisions",
                "Find what I worked on yesterday",
              ].map((item) => (
                <div key={item} className="rounded-[10px] border border-[#E8E8E8] bg-[#FAFAFA] p-4">
                  <p className="text-[13px] text-[#1A1A1A]">{item}</p>
                  <div className="mt-3 h-2 w-2/3 rounded-full bg-[#E8E8E8]" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-[#888]">
              Login is required before chats, memories, insights, decisions, or settings open.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

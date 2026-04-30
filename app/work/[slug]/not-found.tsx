import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80svh] flex items-center justify-center px-6 md:px-10 py-32">
      <div className="text-center max-w-[40ch]">
        <div className="mono text-[11px] uppercase tracking-[0.22em] text-ember mb-6">
          404 · Project not found
        </div>
        <h1 className="display text-[clamp(2.4rem,7vw,6rem)] leading-[1] mb-8">
          That brief never <span className="italic">made it</span> to print.
        </h1>
        <Link
          href="/work"
          data-cursor
          className="mono text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 hover:text-ember"
        >
          ← Back to the index
        </Link>
      </div>
    </main>
  );
}

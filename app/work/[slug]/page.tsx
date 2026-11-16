import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  projects,
  getProjectBySlug,
  getAdjacentProjects,
} from "@/data/projects";
import CaseHero from "@/components/case-hero";
import CaseGallery from "@/components/case-gallery";
import { getCover, getGalleryWithoutCover } from "@/lib/media";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.title} — ${project.client} · Khaled Halwani`,
    description: project.overview ?? project.tagline ?? project.title,
    openGraph: {
      title: `${project.title} — ${project.client}`,
      description: project.overview ?? project.tagline ?? project.title,
      images: [{ url: getCover(project.id)?.src ?? project.image }],
    },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);
  const cover = getCover(project.id);
  const gallery = getGalleryWithoutCover(project.id);

  return (
    <article className="bg-bone text-ink">
      <CaseHero project={project} />

      {/* Lead picture: real shape, never wider than its own pixels */}
      {cover && (
        <section className="px-6 md:px-10 pb-12 md:pb-20">
          <div className="mx-auto" style={{ maxWidth: cover.width }}>
            <Image
              src={cover.src}
              alt={`${project.title}, ${project.client}`}
              width={cover.width}
              height={cover.height}
              sizes="(max-width: 768px) 100vw, 92vw"
              preload
              className="block w-full h-auto rounded-sm ring-1 ring-ink/10 bg-bone-2"
            />
          </div>
        </section>
      )}

      {/* Meta strip */}
      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-ink/15">
        <div className="grid grid-cols-12 gap-6">
          <Meta label="Client" value={project.client} />
          <Meta label="Year" value={project.year.toString()} />
          <Meta label="Category" value={project.category} />
          <Meta label="Region" value={project.region ?? "Global"} />
        </div>
      </section>

      {/* Overview */}
      <section className="px-6 md:px-10 py-24 md:py-40">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
            <div className="text-ember mb-2">§ Overview</div>
            The brief
          </div>
          <div className="col-span-12 md:col-span-8">
            {project.tagline && (
              <p className="display italic text-ember text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.1] mb-8">
                {project.tagline}
              </p>
            )}
            {project.overview && (
              <p className="display text-[clamp(1.5rem,3.4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-ink-soft">
                {project.overview}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Role + Scope split */}
      {(project.role || project.scope) && (
        <section className="px-6 md:px-10 py-16 md:py-24 border-t border-ink/15">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
              <div className="text-ember mb-2">§ Engagement</div>
              Role &amp; scope
            </div>
            {project.role && (
              <div className="col-span-6 md:col-span-4">
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/40 mb-4">
                  Role
                </div>
                <ul className="space-y-2">
                  {project.role.map((r) => (
                    <li
                      key={r}
                      className="display text-[clamp(1.1rem,1.8vw,1.6rem)] leading-tight"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.scope && (
              <div className="col-span-6 md:col-span-5">
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/40 mb-4">
                  Scope
                </div>
                <ul className="space-y-2">
                  {project.scope.map((s) => (
                    <li
                      key={s}
                      className="display text-[clamp(1.1rem,1.8vw,1.6rem)] leading-tight"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* The work */}
      {gallery.length > 0 && (
        <section className="px-6 md:px-10 py-16 md:py-24 border-t border-ink/15">
          <div className="grid grid-cols-12 gap-6 mb-10 md:mb-14">
            <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
              <div className="text-ember mb-2">§ The work</div>
              {gallery.length + (cover ? 1 : 0)} pieces
            </div>
          </div>
          <CaseGallery items={gallery} title={project.title} />
        </section>
      )}

      {/* Contact line */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-ink/15">
        <p className="display text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.15] max-w-[30ch]">
          Want to talk about this piece?{" "}
          <a
            href={`mailto:khaled.halwani@gmail.com?subject=${encodeURIComponent(
              `${project.client}: ${project.title}`,
            )}`}
            data-cursor
            data-cursor-label="email"
            className="italic text-ember underline underline-offset-4"
          >
            Get in touch →
          </a>
        </p>
      </section>

      {/* Prev / Next */}
      <nav className="grid grid-cols-2 border-t border-ink/15">
        {prev && (
          <Link
            href={`/work/${prev.id}`}
            data-cursor
            data-cursor-label="prev"
            className="group block p-8 md:p-12 border-r border-ink/15 hover:bg-bone-2 transition-colors"
          >
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/45 mb-3">
              ← Previous
            </div>
            <div className="display text-[clamp(1.4rem,3.2vw,2.6rem)] leading-tight group-hover:text-ember transition-colors">
              {prev.title}
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/55 mt-2">
              {prev.client} · {prev.year}
            </div>
          </Link>
        )}
        {next && (
          <Link
            href={`/work/${next.id}`}
            data-cursor
            data-cursor-label="next"
            className="group block p-8 md:p-12 text-right hover:bg-bone-2 transition-colors"
          >
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/45 mb-3">
              Next →
            </div>
            <div className="display text-[clamp(1.4rem,3.2vw,2.6rem)] leading-tight group-hover:text-ember transition-colors">
              {next.title}
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/55 mt-2">
              {next.client} · {next.year}
            </div>
          </Link>
        )}
      </nav>

      {/* Back to index */}
      <div className="px-6 md:px-10 py-16 text-center border-t border-ink/15">
        <Link
          href="/work"
          data-cursor
          data-cursor-label="index"
          className="mono text-[11px] uppercase tracking-[0.22em] hover:text-ember transition-colors"
        >
          ↑ All work
        </Link>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-6 md:col-span-3">
      <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/45 mb-2">
        {label}
      </div>
      <div className="display text-[clamp(1.1rem,1.6vw,1.4rem)] leading-tight">
        {value}
      </div>
    </div>
  );
}

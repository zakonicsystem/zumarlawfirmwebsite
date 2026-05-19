import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import ProcessSection from "@/components/ProcessSection";
import Reveal from "@/components/Reveal";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("about");
}

export default async function AboutPage() {
  const { about, pageContent } = await readCmsData();
  const teamMembers = (pageContent.team?.members || []).slice(0, 3);
  const sharedProcess = about.sharedProcess || {};

  return (
    <>
      <Reveal />
      <PageHeader eyebrow={about.eyebrow} title={about.title} copy={about.copy} />

      <section className="overflow-hidden bg-[#fffdfb] py-14 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-14">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="relative" data-reveal="left">
              <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-secondary/50 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-white p-3 shadow-2xl shadow-primary/15">
                <img className="h-[520px] w-full rounded-[1.5rem] object-cover" src={about.image} alt="Zumar Law Firm about" />
                <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/15 bg-white/12 p-5 text-white backdrop-blur">
                  <p className="text-sm font-black uppercase text-secondary">{about.imageOverlayEyebrow}</p>
                  <h2 className="mt-2 text-3xl font-black">{about.imageOverlayTitle}</h2>
                </div>
              </div>
            </div>

            <div data-reveal="right">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{about.introEyebrow}</p>
              <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">
                {about.introTitle}
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                {about.introCopy}
              </p>
              <p className="mt-4 text-lg leading-8 text-muted">
                {about.introSecondCopy}
              </p>

              {(about.stats || []).length ? (
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {(about.stats || []).map((stat, index) => (
                    <div className="rounded-lg border border-primary/10 bg-paper p-4" key={`${stat.value}-${stat.label}-${index}`}>
                      <strong className="block text-3xl font-black text-primary">{stat.value}</strong>
                      <span className="mt-1 block text-sm font-bold text-muted">{stat.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {(about.highlights || []).filter((item) => item.enabled !== false).map((item, index) => (
              <article className="group rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10" data-reveal="up" key={`${item.title}-${index}`}>
                <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-primary shadow-lg shadow-primary/10 transition group-hover:rotate-3">
                  <FaIcon className="size-7" name={item.icon} />
                </span>
                <h2 className="mt-6 text-3xl font-black text-primary">{item.title}</h2>
                <p className="mt-3 text-lg leading-8 text-ink/75">{item.copy}</p>
              </article>
            ))}
          </div>

          <ProcessSection section={sharedProcess} steps={sharedProcess.steps || []} className="rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20" />

          {teamMembers.length ? (
            <section className="grid gap-8" data-reveal="up">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{about.teamPreview?.eyebrow || "Team"}</p>
                  <h2 className="max-w-3xl text-3xl font-black leading-tight text-primary sm:text-4xl">
                    {about.teamPreview?.title || "Meet the people behind the work."}
                  </h2>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
                    {about.teamPreview?.copy}
                  </p>
                </div>
                <Link className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-primary/90" href={about.teamPreview?.buttonHref || "/team"}>
                  {about.teamPreview?.buttonText || "Meet the Team"}
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member) => (
                  <article className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-xl shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10" key={member.name}>
                    <img className="h-72 w-full object-cover" src={member.image} alt={member.name} />
                    <div className="p-6">
                      <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase text-primary/60">
                        <FaIcon className="size-3.5" name="headset" />
                        {member.designation || member.role}
                      </p>
                      <h3 className="text-2xl font-black text-primary">{member.name}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </>
  );
}

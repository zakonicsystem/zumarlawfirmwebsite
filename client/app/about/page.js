import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import ProcessSection from "@/components/ProcessSection";
import Reveal from "@/components/Reveal";
import TeamMemberCard from "@/components/TeamMemberCard";
import JsonLd from "@/components/JsonLd";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import { generateAboutPageSchema, generateOrganizationSchema } from "@/lib/schema";
import { plainText } from "@/lib/text";

export async function generateMetadata() {
  return getPageMetadata("about");
}

export default async function AboutPage() {
  const { about, pageContent } = await readCmsData();
  const teamMembers = (pageContent.team?.members || []);
  const sharedProcess = about.sharedProcess || {};
  const milestones = (about.milestones || []).filter((item) => item.enabled !== false);
  const coreValues = (about.coreValues || []).filter((item) => item.enabled !== false);
  const certificates = (about.certifications?.items || []).filter((item) => item.enabled !== false);

  return (
    <>
      <JsonLd schema={generateAboutPageSchema()} />
      <JsonLd schema={generateOrganizationSchema()} />
      <Reveal />
      <PageHeader eyebrow={about.eyebrow} title={about.title} copy={about.copy} />

      <section className="overflow-hidden bg-[#fffdfb] py-14 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-14">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="relative" data-reveal="left">
              <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-secondary/50 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-white p-3 shadow-2xl shadow-primary/15">
                <img className="h-full w-full rounded-[1.5rem] object-cover" src={about.image} alt={`${plainText(about.title, "Zumar Law Firm")} about image`} />
              </div>
            </div>

            <div data-reveal="right">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{about.introEyebrow && <RichContent content={about.introEyebrow} inline />}</p>
              <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">
                {about.introTitle && <RichContent content={about.introTitle} inline />}
              </h2>
              <div className="mt-6 text-lg leading-8 text-muted">
                {about.introCopy && <RichContent content={about.introCopy} />}
              </div>
              <div className="mt-4 text-lg leading-8 text-muted">
                {about.introSecondCopy && <RichContent content={about.introSecondCopy} />}
              </div>

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

          <section className="grid gap-6 rounded-[2rem] border border-primary/10 bg-white p-6 shadow-xl shadow-primary/5 sm:p-8" data-reveal="up">
            <div className="max-w-4xl">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{about.overviewEyebrow ? <RichContent content={about.overviewEyebrow} inline /> : "Company Overview"}</p>
              <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">{about.overviewTitle && <RichContent content={about.overviewTitle} inline />}</h2>
              <div className="mt-5 text-lg leading-8 text-muted">
                {about.overviewCopy && <RichContent content={about.overviewCopy} />}
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]" data-reveal="up">
            <div className="rounded-[2rem] bg-primary p-7 text-white shadow-2xl shadow-primary/15 sm:p-9">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{about.historyEyebrow ? <RichContent content={about.historyEyebrow} inline /> : "Company History"}</p>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{about.historyTitle && <RichContent content={about.historyTitle} inline />}</h2>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Established</span>
                <strong className="mt-2 block text-5xl font-black">{about.establishmentYear}</strong>
              </div>
              <div className="mt-6 text-lg leading-8 text-white/75">
                {about.historyCopy && <RichContent content={about.historyCopy} />}
              </div>
            </div>

            {milestones.length ? (
              <div className="grid gap-4">
                {milestones.map((item, index) => (
                  <article className="grid gap-4 rounded-[1.5rem] border border-primary/10 bg-white p-5 shadow-lg shadow-primary/5 sm:grid-cols-[110px_1fr] sm:p-6" key={`${item.year}-${item.title}-${index}`}>
                    <div className="text-3xl font-black text-primary">{item.year}</div>
                    <div>
                      <h3 className="text-2xl font-black text-primary">{item.title && <RichContent content={item.title} inline />}</h3>
                      <div className="mt-2 leading-7 text-muted">{item.copy && <RichContent content={item.copy} />}</div>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>

          <section className="grid gap-5 lg:grid-cols-2" data-reveal="up">
            <article className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:p-8">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">Mission</p>
              <h2 className="text-3xl font-black text-primary">{about.missionTitle ? <RichContent content={about.missionTitle} inline /> : "Mission Statement"}</h2>
              <div className="mt-4 text-lg leading-8 text-muted">{about.missionCopy && <RichContent content={about.missionCopy} />}</div>
            </article>
            <article className="rounded-[2rem] border border-primary/10 bg-primary p-7 text-white shadow-xl shadow-primary/15 sm:p-8">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-secondary">Vision</p>
              <h2 className="text-3xl font-black">{about.visionTitle ? <RichContent content={about.visionTitle} inline /> : "Vision Statement"}</h2>
              <div className="mt-4 text-lg leading-8 text-white/75">{about.visionCopy && <RichContent content={about.visionCopy} />}</div>
            </article>
          </section>

          {coreValues.length ? (
            <section className="grid gap-6" data-reveal="up">
              <div>
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">Core Values</p>
                <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">The standards behind our client work.</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {coreValues.map((item, index) => (
                  <article className="rounded-[1.5rem] border border-primary/10 bg-white p-5 shadow-lg shadow-primary/5" key={`${item.title}-${index}`}>
                    <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                      <FaIcon className="size-5" name={item.icon || "check"} />
                    </span>
                    <h3 className="mt-4 text-xl font-black text-primary">{item.title && <RichContent content={item.title} inline />}</h3>
                    <div className="mt-2 text-sm leading-6 text-muted">{item.copy && <RichContent content={item.copy} />}</div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {(about.highlights || []).filter((item) => item.enabled !== false).map((item, index) => (
              <article className="group rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10" data-reveal="up" key={`${item.title}-${index}`}>
                <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-primary shadow-lg shadow-primary/10 transition group-hover:rotate-3">
                  <FaIcon className="size-7" name={item.icon} />
                </span>
                <h2 className="mt-6 text-3xl font-black text-primary">{item.title && <RichContent content={item.title} inline />}</h2>
                <div className="mt-3 text-lg leading-8 text-ink/75">
                  {item.copy && <RichContent content={item.copy} />}
                </div>
              </article>
            ))}
          </div>

          {about.certifications?.enabled !== false && certificates.length ? (
            <section className="grid gap-8 rounded-[2rem] bg-paper p-6 sm:p-8" data-reveal="up">
              <div className="max-w-3xl">
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{about.certifications?.eyebrow ? <RichContent content={about.certifications.eyebrow} inline /> : "Registrations & Certifications"}</p>
                <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">{about.certifications?.title && <RichContent content={about.certifications.title} inline />}</h2>
                <div className="mt-4 text-lg leading-8 text-muted">
                  {about.certifications?.copy && <RichContent content={about.certifications.copy} />}
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {certificates.map((item, index) => (
                  <article className="overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white shadow-xl shadow-primary/5" key={`${item.title}-${index}`}>
                    {item.image ? (
                      <img className="h-52 w-full object-cover" src={item.image} alt={`${plainText(item.title, "Zumar Law Firm certificate")} certificate`} loading="lazy" decoding="async" />
                    ) : (
                      <div className="grid h-52 place-items-center bg-white">
                        <span className="grid size-20 place-items-center rounded-3xl bg-secondary text-primary">
                          <FaIcon className="size-9" name={item.icon || "certificate"} />
                        </span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-xl font-black text-primary">{item.title && <RichContent content={item.title} inline />}</h3>
                      <p className="mt-2 text-sm font-bold text-muted">{item.issuer}</p>
                      <p className="mt-3 rounded-2xl bg-paper px-4 py-3 text-sm font-black text-primary">{item.number}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <ProcessSection section={sharedProcess} steps={sharedProcess.steps || []} className="rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20" />

          {teamMembers.length ? (
            <section className="grid gap-8" data-reveal="up">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{about.teamPreview?.eyebrow ? <RichContent content={about.teamPreview.eyebrow} inline /> : "Team"}</p>
                  <h2 className="max-w-3xl text-3xl font-black leading-tight text-primary sm:text-4xl">
                    {about.teamPreview?.title ? <RichContent content={about.teamPreview.title} inline /> : "Meet our professional team."}
                  </h2>
                  <div className="mt-4 max-w-3xl text-lg leading-8 text-muted">
                    {about.teamPreview?.copy && <RichContent content={about.teamPreview?.copy} />}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.filter((member) => member.enabled !== false).map((member) => (
                  <TeamMemberCard member={member} headingLevel="h3" key={member.name} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </>
  );
}

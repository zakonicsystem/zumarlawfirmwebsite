import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { generateOrganizationSchema } from "@/lib/schema";
import { plainText } from "@/lib/text";

export async function generateMetadata() {
  return getPageMetadata("careers");
}

export default async function CareersPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.careers;

  return (
    <>
      <JsonLd schema={generateOrganizationSchema()} />
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-paper via-white to-secondary/45 py-16 sm:py-20">
        <div className="absolute -left-24 top-16 -z-10 h-72 w-72 rounded-full bg-secondary/50 blur-3xl" />
        <div className="absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2 shadow-2xl shadow-primary/10">
            <img className="h-[420px] w-full rounded-[1.5rem] object-cover" src={page.image} alt={`${plainText(page.introTitle || page.title, "Zumar Law Firm careers")} image`} />
          </div>
          <div className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-2xl shadow-primary/10 sm:p-9">
            <p className="text-sm font-black uppercase tracking-wide text-primary">{page.introEyebrow}</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-primary sm:text-4xl">{page.introTitle}</h2>
            <p className="mt-5 leading-8 text-muted">
              {page.introCopy}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {(page.values || []).filter((item) => item.enabled !== false).map((item, index) => (
                <div className="rounded-3xl bg-paper p-5" key={`${item.title || "value"}-${index}`}>
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary text-white">
                    <FaIcon className="size-5" name={item.icon} />
                  </span>
                  <h3 className="mt-4 font-black text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-black uppercase text-primary">{page.openingsEyebrow}</p>
              <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{page.openingsTitle}</h2>
            </div>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1" href={page.openingsButtonHref || "/contact"}>
              {page.openingsButtonText}
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {(page.openings || []).filter((job) => job.enabled !== false).map((job, index) => (
              <article className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-xl shadow-primary/5 transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15" key={`${job.title || "opening"}-${index}`}>
                <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
                  <FaIcon className="size-6" name={job.icon} />
                </span>
                <h3 className="mt-6 text-2xl font-black leading-tight text-primary">{job.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide text-primary/70">
                  <span className="rounded-full bg-paper px-3 py-2">{job.type}</span>
                  <span className="rounded-full bg-paper px-3 py-2">{job.location}</span>
                </div>
                <p className="mt-5 leading-7 text-muted">{job.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-white sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-secondary">{page.processEyebrow}</p>
            <h2 className="text-4xl font-black leading-tight sm:text-5xl">{page.processTitle}</h2>
            <p className="mt-5 leading-8 text-white/75">
              {page.processCopy}
            </p>
          </div>
          <div className="grid gap-4">
            {(page.steps || []).map((step, index) => (
              <div className="flex gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-5" key={step}>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-black text-primary">{index + 1}</span>
                <p className="self-center font-bold leading-7 text-white/85">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

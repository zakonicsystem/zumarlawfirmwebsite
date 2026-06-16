import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import { findBySlug, readCmsData } from "@/lib/cmsStore";
import { notFound } from "next/navigation";
import { plainText } from "@/lib/text";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const { branches } = await readCmsData();
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { branches } = await readCmsData();
  const branch = findBySlug(branches, slug);
  return branch ? buildMetadata(branch, {
    metaTitle: `${plainText(branch.name, "Branch")} Branch`,
    metaDescription: branch.address,
    path: `/branches/${branch.slug}`,
    image: branch.image
  }) : {};
}

export default async function BranchDetailPage({ params }) {
  const { slug } = await params;
  const { branches, pageContent } = await readCmsData();
  const branch = findBySlug(branches, slug);
  const page = pageContent.branchDetail || {};
  const branchPhone = branch?.phone?.replace(/[^+\d]/g, "");

  if (!branch) {
    notFound();
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-primary/10 bg-gradient-to-br from-paper via-white to-secondary/50 py-14 sm:py-20">
        <div className="absolute -left-24 top-8 -z-10 h-72 w-72 rounded-full bg-secondary/50 blur-3xl" />
        <div className="absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="min-w-0">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-wide text-primary shadow-lg shadow-primary/5">
              <FaIcon className="size-4 shrink-0" name="landmark" />
              {page.eyebrow ? <RichContent content={page.eyebrow} inline /> : "Branch Office"}
            </p>
            <h1 className="max-w-full break-words text-4xl font-black leading-tight text-primary sm:text-5xl lg:text-5xl">{branch.name && <RichContent content={branch.name} inline />}</h1>
            <a className="mt-5 inline-flex max-w-2xl items-start gap-3 rounded-3xl bg-white/70 p-4 text-base leading-8 text-muted shadow-lg shadow-primary/5 transition hover:bg-secondary/70 hover:text-primary sm:text-lg" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
              <FaIcon className="mt-1 size-5 shrink-0 text-primary" name="landmark" />
              <span className="break-words">{branch.address && <RichContent content={branch.address} inline />}</span>
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white shadow-xl shadow-primary/15 transition hover:-translate-y-1" href={`tel:${branchPhone}`}>
                <FaIcon className="mr-2 size-4" name="phone" />
                Call Branch
              </a>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/10 bg-white px-6 text-sm font-black text-primary shadow-xl shadow-primary/5 transition hover:-translate-y-1" href="/contact">
                <FaIcon className="mr-2 size-4" name="email" />
                {page.appointmentLabel ? <RichContent content={page.appointmentLabel} inline /> : "Send Inquiry"}
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white p-2 shadow-2xl shadow-primary/10">
            <img className="h-72 w-full rounded-[1.5rem] object-cover sm:h-80" src={branch.image} alt={`${plainText(branch.name, "Zumar Law Firm")} branch office`} />
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] min-w-0 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-xl shadow-primary/5 sm:p-8">
            <p className="text-sm font-black uppercase tracking-wide text-primary">{page.detailsEyebrow ? <RichContent content={page.detailsEyebrow} inline /> : "Visit Our Office"}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-primary sm:text-4xl">{page.detailsTitle ? <RichContent content={page.detailsTitle} inline /> : "Branch Details"}</h2>
            <div className="mt-4 max-w-3xl leading-8 text-muted">
              {page.detailsCopy && <RichContent content={page.detailsCopy} />}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <a className="min-w-0 rounded-3xl border border-primary/10 bg-paper/60 p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 flex flex-col justify-between" href={`tel:${branchPhone}`}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <FaIcon className="size-5" name="phone" />
                </span>
                <span className="mt-4 block text-sm font-black uppercase text-primary/70">Phone</span>
                <span className="mt-1 block break-words text-lg font-black text-ink">{branch.phone}</span>
              </a>
              <a className="min-w-0 rounded-3xl border border-primary/10 bg-paper/60 p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 flex flex-col justify-between" href={`mailto:${branch.email}`}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <FaIcon className="size-5" name="email" />
                </span>
                <span className="mt-4 block text-sm font-black uppercase text-primary/70">Email</span>
                <span className="mt-1 block break-words text-lg font-black text-ink">{branch.email}</span>
              </a>
              <a className="min-w-0 rounded-3xl border border-primary/10 bg-paper/60 p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 flex flex-col justify-between cursor-pointer" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <FaIcon className="size-5" name="landmark" />
                </span>
                <span className="mt-4 block text-sm font-black uppercase text-primary/70">Address</span>
                <span className="mt-1 block break-words text-lg font-black leading-7 text-ink">{branch.address && <RichContent content={branch.address} inline />}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
                  {page.mapLabel ? <RichContent content={page.mapLabel} inline /> : "Open in Google Maps"}
                  <FaIcon className="size-3.5" name="arrowRight" />
                </span>
              </a>
            </div>
          </div>
          <aside className="rounded-[2rem] bg-primary p-6 text-white shadow-2xl shadow-primary/15 sm:p-8">
            <FaIcon className="size-10 text-secondary" name="headset" />
            <h3 className="mt-5 text-2xl font-black">{page.supportTitle ? <RichContent content={page.supportTitle} inline /> : "Need branch support?"}</h3>
            <div className="mt-3 leading-7 text-white/75">
              {page.supportCopy && <RichContent content={page.supportCopy} />}
            </div>
            <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-6 text-sm font-black text-primary" href="/contact">
              {page.consultationLabel ? <RichContent content={page.consultationLabel} inline /> : "Request Consultation"}
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

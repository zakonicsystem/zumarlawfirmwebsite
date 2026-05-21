import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import { findBySlug, readCmsData } from "@/lib/cmsStore";
import { getRecordMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { services } = await readCmsData();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { services } = await readCmsData();
  const service = findBySlug(services, resolvedParams.slug);

  if (!service) {
    return {};
  }

  return getRecordMetadata(service);
}

export default async function ServiceDetailPage({ params }) {
  const resolvedParams = await params;
  const { pageContent, services } = await readCmsData();
  const service = findBySlug(services, resolvedParams.slug);
  const detailContent = pageContent.serviceDetail || {};

  if (!service) {
    notFound();
  }

  const relatedServices = services
    .filter((item) => item.enabled !== false && item.slug !== service.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === service.category) + Number((a.serviceType || "national") === (service.serviceType || "national"));
      const bScore = Number(b.category === service.category) + Number((b.serviceType || "national") === (service.serviceType || "national"));
      return bScore - aScore;
    })
    .slice(0, 3);

  return (
    <>
      <section className="border-b border-primary/10 bg-gradient-to-br from-paper via-white to-secondary/60 py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-primary">{service.category || detailContent.eyebrowFallback}</p>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <span className="grid size-20 shrink-0 place-items-center rounded-[1.5rem] bg-white shadow-xl shadow-primary/10 ring-1 ring-primary/10">
                <FaIcon className="size-9 text-primary" name={service.icon} />
              </span>
              <h1 className="text-5xl font-black leading-tight text-primary sm:text-5xl">{service.title}</h1>
            </div>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{service.summary}</p>
          </div>
          <div className="grid min-w-64 gap-4 rounded-[2rem] bg-white p-6 shadow-2xl shadow-primary/10 ring-1 ring-primary/10">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-primary/50">{detailContent.feeLabel}</p>
              <strong className="mt-2 block text-2xl font-black text-primary">{service.formattedPrice}</strong>
            </div>
            <div className="h-px bg-primary/10" />
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-primary/50">{detailContent.timelineLabel || "Timeline"}</p>
              <strong className="mt-2 block text-xl font-black text-ink">{service.timeline}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:p-9">
            <h2 className="text-3xl font-black text-primary">{detailContent.overviewTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              {detailContent.overviewCopy}
            </p>

            <h3 className="mt-10 text-2xl font-black text-primary">{detailContent.processTitle}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(detailContent.processSteps || []).map((item, index) => (
                <div className="rounded-2xl border border-primary/10 bg-paper p-4" key={`${item}-${index}`}>
                  <span className="text-xs font-black uppercase text-primary/50">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-2 font-bold leading-7 text-ink/80">{item}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-10 text-2xl font-black text-primary">{detailContent.requirementsTitle}</h3>
            {service.requirements.length > 0 ? (
              <ul className="mt-5 grid gap-3">
                {service.requirements.map((item) => (
                  <li className="flex gap-3 rounded-2xl bg-paper px-4 py-3 text-ink/80" key={item}>
                    <FaIcon className="mt-1 size-4 shrink-0 text-primary" name="filing" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-lg leading-8 text-muted">
                {detailContent.emptyRequirementsText}
              </p>
            )}
          </div>

          <aside className="sticky top-28 rounded-[2rem] border border-primary/10 bg-primary p-7 text-white shadow-2xl shadow-primary/20">
            <p className="leading-7 text-white/70">{detailContent.feeNote}</p>
            <div className="mt-7 grid gap-3">
              <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-5 text-sm font-black text-primary transition hover:-translate-y-1" href={detailContent.startOnlineHref} target="_blank" rel="noreferrer">
                <FaIcon className="mr-2 size-4" name="registration" />
                {detailContent.startOnlineLabel}
              </a>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10" href={detailContent.appointmentHref || "/appointment"}>
                <FaIcon className="mr-2 size-4" name="appointment" />
                {detailContent.appointmentLabel}
              </Link>
              <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10" href={detailContent.callHref}>
                <FaIcon className="mr-2 size-4" name="phone" />
                {detailContent.callLabel}
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#1ebe5d]"
                href={`https://wa.me/${detailContent.whatsappPhone || "923035988574"}?text=${encodeURIComponent(`Hello Zumar Law Firm, I need help with ${service.title}.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaIcon className="mr-2 size-4" name="phone" />
                {detailContent.whatsappLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {relatedServices.length ? (
        <section className="bg-paper py-16 sm:py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-sm font-black uppercase text-primary">{detailContent.relatedEyebrow}</p>
                <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{detailContent.relatedTitle}</h2>
              </div>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-primary/90" href="/services">
                {detailContent.allServicesLabel}
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedServices.map((item) => (
                <Link
                  className="group flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white p-6 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-2 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/15"
                  key={item.slug}
                  href={`/services/${item.slug}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-14 place-items-center rounded-2xl bg-secondary/50 transition duration-300 group-hover:rotate-3 group-hover:scale-110">
                        <FaIcon className="size-7 text-primary" name={item.icon} />
                      </span>
                      <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-black text-primary">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="mt-7 text-2xl font-black leading-tight text-primary">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <strong className="text-primary">{item.formattedPrice}</strong>
                    <span className="rounded-full border border-primary/15 px-4 py-2 text-xs font-black text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      Details
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import ServiceCarousel from "@/components/ServiceCarousel";
import { findBySlug, readCmsData } from "@/lib/cmsStore";
import { getRecordMetadata } from "@/lib/seo";
import { generateServiceSchema, generateFAQSchema } from "@/lib/schema";
import { notFound } from "next/navigation";

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

  const automaticRelatedServices = services
    .filter((item) => item.enabled !== false && item.slug !== service.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === service.category) + Number((a.serviceType || "national") === (service.serviceType || "national"));
      const bScore = Number(b.category === service.category) + Number((b.serviceType || "national") === (service.serviceType || "national"));
      return bScore - aScore;
    })
    .slice(0, 3);
  const manualRelatedServices = mapServiceSlugs(services, service.relatedServiceSlugs, service.slug).slice(0, 3);
  const relatedServices = manualRelatedServices.length ? manualRelatedServices : automaticRelatedServices;
  const automaticCarouselServices = services
    .filter((item) => item.enabled !== false && item.slug !== service.slug)
    .slice(0, 14);
  const manualCarouselServices = mapServiceSlugs(services, service.carouselServiceSlugs, service.slug).slice(0, 14);
  const carouselServices = manualCarouselServices.length ? manualCarouselServices : automaticCarouselServices;
  const serviceFaqItems = (service.faqItems || []).filter((item) => item.enabled !== false);
  const fallbackFaqItems = (detailContent.faqItems || []).filter((item) => item.enabled !== false);
  const faqItems = serviceFaqItems.length ? serviceFaqItems : fallbackFaqItems;
  const overviewTitle = service.overviewTitle || detailContent.overviewTitle;
  const overviewCopy = service.overviewCopy || detailContent.overviewCopy;
  const processTitle = service.processTitle || detailContent.processTitle;
  const processSteps = Array.isArray(service.processSteps) && service.processSteps.length ? service.processSteps : detailContent.processSteps || [];

  return (
    <>
      <JsonLd schema={generateServiceSchema(service)} />
      {faqItems.length > 0 ? (
        <JsonLd schema={generateFAQSchema(faqItems, `https://zumarlawfirm.com/services/${service.slug}`)} />
      ) : null}
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
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {service.summary && <RichContent content={service.summary} />}
            </p>
          </div>
          <div className="grid min-w-64 gap-4 rounded-[2rem] bg-white p-6 shadow-2xl shadow-primary/10 ring-1 ring-primary/10">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-primary/50">{detailContent.feeLabel && <RichContent content={detailContent.feeLabel} />}</p>
              <strong className="mt-2 block text-2xl font-black text-primary">{service.formattedPrice}</strong>
            </div>
            <div className="h-px bg-primary/10" />
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-primary/50">{detailContent.timelineLabel ? <RichContent content={detailContent.timelineLabel} /> : "Timeline"}</p>
              <strong className="mt-2 block text-xl font-black text-ink">{service.timeline}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:p-9">
            <h2 className="text-3xl font-black text-primary">{overviewTitle && <RichContent content={overviewTitle} inline />}</h2>
            <div className="mt-5 text-lg leading-8 text-muted">
              {overviewCopy && <RichContent content={overviewCopy} />}
            </div>

            <h3 className="mt-10 text-2xl font-black text-primary">{processTitle && <RichContent content={processTitle} inline />}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {processSteps.map((item, index) => (
                <div className="rounded-2xl border border-primary/10 bg-paper p-4" key={`${item}-${index}`}>
                  <span className="text-xs font-black uppercase text-primary/50">{String(index + 1).padStart(2, "0")}</span>
                  <div className="mt-2 font-bold leading-7 text-ink/80">{item && <RichContent content={item} />}</div>
                </div>
              ))}
            </div>

            <h3 className="mt-10 text-2xl font-black text-primary">{detailContent.requirementsTitle}</h3>
            {service.requirements.length > 0 ? (
              <ul className="mt-5 grid gap-3">
                {service.requirements.map((item) => (
                  <li className="flex gap-3 rounded-2xl bg-paper px-4 py-3 text-ink/80" key={item}>
                    <FaIcon className="mt-1 size-4 shrink-0 text-primary" name="filing" />
                    <span>{item && <RichContent content={item} />}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-lg leading-8 text-muted">
                {detailContent.emptyRequirementsText && <RichContent content={detailContent.emptyRequirementsText} />}
              </p>
            )}


          </div>

          <aside className="sticky top-28 rounded-[2rem] border border-primary/10 bg-primary p-7 text-white shadow-2xl shadow-primary/20">
            <div className="leading-7 text-white/70">{detailContent.feeNote && <RichContent content={detailContent.feeNote} />}</div>
            <div className="mt-7 grid gap-3">
              <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-5 text-sm font-black text-primary transition hover:-translate-y-1" href={detailContent.startOnlineHref} target="_blank" rel="noreferrer">
                <FaIcon className="mr-2 size-4" name="registration" />
                {detailContent.startOnlineLabel && <RichContent content={detailContent.startOnlineLabel} />}
              </a>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10" href={detailContent.appointmentHref || detailContent.contactHref || "/contact"}>
                <FaIcon className="mr-2 size-4" name="phone" />
                {(detailContent.appointmentLabel || detailContent.contactLabel) ? <RichContent content={detailContent.appointmentLabel || detailContent.contactLabel} /> : "Send Inquiry"}
              </Link>
              <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10" href={detailContent.callHref}>
                <FaIcon className="mr-2 size-4" name="phone" />
                {detailContent.callLabel && <RichContent content={detailContent.callLabel} />}
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#1ebe5d]"
                href={`https://wa.me/${detailContent.whatsappPhone || "923035988574"}?text=${encodeURIComponent(`Hello Zumar Law Firm, I need help with ${service.title}.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaIcon className="mr-2 size-4" name="phone" />
                {detailContent.whatsappLabel && <RichContent content={detailContent.whatsappLabel} />}
              </a>
            </div>

            {relatedServices.length ? (
              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">{detailContent.relatedEyebrow && <RichContent content={detailContent.relatedEyebrow} />}</p>
                <div className="mt-4 grid gap-3">
                  {relatedServices.map((item) => (
                    <Link className="group rounded-2xl border border-white/10 bg-white/8 p-4 transition hover:-translate-y-0.5 hover:bg-white/12" href={`/services/${item.slug}`} key={item.slug} prefetch={false}>
                      <span className="flex items-start gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                          <FaIcon className="size-4" name={item.icon} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-black leading-5 text-white">{item.title && <RichContent content={item.title} />}</span>
                          <span className="mt-1 block text-xs font-bold text-white/60">{item.formattedPrice}</span>
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {(service.benefits || []).length > 0 ? (
        <section className="bg-gradient-to-br from-secondary/10 via-white to-secondary/5 py-16 sm:py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <div className="mb-12">
              <p className="mb-3 text-sm font-black uppercase text-primary">{detailContent.benefitsEyebrow || "Benefits"}</p>
              <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{detailContent.benefitsTitle || "Key Benefits"}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
                {detailContent.benefitsCopy && <RichContent content={detailContent.benefitsCopy} />}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(service.benefits || []).map((item, index) => (
                <div className="group rounded-2xl border border-primary/10 bg-white p-7 shadow-lg shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/15" key={`${item}-${index}`}>
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-primary transition duration-300 group-hover:scale-110">
                    <FaIcon className="size-6" name="check" />
                  </span>
                  <div className="mt-5 text-lg font-bold leading-7 text-ink">{item && <RichContent content={item} />}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {(service.eligibility || []).length > 0 ? (
        <section className="py-16 sm:py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <div className="mb-12">
              <p className="mb-3 text-sm font-black uppercase text-primary">{detailContent.eligibilityEyebrow || "Requirements"}</p>
              <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{detailContent.eligibilityTitle || "Service Eligibility"}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
                {detailContent.eligibilityCopy && <RichContent content={detailContent.eligibilityCopy} />}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(service.eligibility || []).map((item, index) => (
                <div className="group rounded-2xl border border-primary/10 bg-white p-7 shadow-md shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/15" key={`${item}-${index}`}>
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex shrink-0 items-center justify-center rounded-full bg-secondary/15 p-2">
                      <FaIcon className="size-5 text-primary" name="check" />
                    </span>
                    <div className="text-lg font-bold leading-7 text-ink">{item && <RichContent content={item} />}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faqItems.length > 0 ? (
        <section className="bg-[#fffdfb] py-16 sm:py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <div className="mb-10">
              <p className="mb-3 text-sm font-black uppercase text-primary">{detailContent.faqEyebrow || "FAQ"}</p>
              <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{detailContent.faqTitle || "Frequently Asked Questions"}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
                {detailContent.faqCopy && <RichContent content={detailContent.faqCopy} />}
              </p>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      ) : null}

      {detailContent.longDescription ? (
        <section className="py-16 sm:py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <div className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:p-9">
              <h2 className="text-3xl font-black text-primary">{detailContent.longDescriptionTitle || "Detailed Information"}</h2>
              <div className="prose prose-primary mt-6 max-w-none text-lg leading-8 text-muted">
                <RichContent content={detailContent.longDescription} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {carouselServices.length ? (
        <section className="bg-paper py-16 sm:py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-sm font-black uppercase text-primary">{detailContent.relatedEyebrow}</p>
                <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{detailContent.otherServicesTitle || detailContent.relatedTitle || "Other Services"}</h2>
              </div>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-primary/90" href="/services">
                {detailContent.allServicesLabel}
              </Link>
            </div>

            <ServiceCarousel items={carouselServices} />
          </div>
        </section>
      ) : null}
    </>
  );
}

function mapServiceSlugs(services, slugs, currentSlug) {
  if (!Array.isArray(slugs) || !slugs.length) {
    return [];
  }

  const bySlug = new Map(
    services
      .filter((service) => service.enabled !== false && service.slug !== currentSlug)
      .map((service) => [service.slug, service])
  );

  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
}

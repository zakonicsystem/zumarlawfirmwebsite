import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import ProcessSection from "@/components/ProcessSection";
import ServiceCarousel from "@/components/ServiceCarousel";
import ServiceBrowser from "@/components/ServiceBrowser";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import YoutubeVideoCarousel from "@/components/YoutubeVideoCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import { plainText } from "@/lib/text";

export function SectionDivider() {
  return (
    <div className="relative bg-[#fffdfb]" aria-hidden="true">
      <div className="mx-auto flex h-12 w-[min(1180px,calc(100%-32px))] items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        <div className="mx-5 grid size-9 place-items-center rounded-full border border-primary/10 bg-white shadow-lg shadow-primary/5">
          <span className="size-2 rounded-full bg-secondary" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      </div>
    </div>
  );
}

export function HomeFeaturedSection({ section, services }) {
  if (section?.enabled === false) {
    return null;
  }

  return (
    <section className="my-10 py-5 sm:py-10" aria-label="Featured service carousel" data-reveal="up">
      <div className="mx-auto w-[min(1180px,calc(100%-24px))] sm:w-[min(1180px,calc(100%-32px))]">
        <div className="mb-7 grid gap-4 sm:mb-10 sm:gap-6 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div data-reveal="left">
            <p className="mb-3 text-sm font-black uppercase text-primary">{section?.eyebrow && <RichContent content={section.eyebrow} inline />}</p>
            <h2 className="text-3xl font-black leading-tight text-primary sm:text-6xl">{section?.title && <RichContent content={section.title} inline />}</h2>
          </div>
          <p className="text-sm leading-7 text-muted sm:text-base sm:leading-8 lg:text-lg" data-reveal="right">
            {section?.copy && <RichContent content={section?.copy} />}
          </p>
        </div>
        <div data-reveal="zoom">
          <ServiceCarousel items={services} />
        </div>
      </div>
    </section>
  );
}

export function HomeWhyChooseSection({ content }) {
  if (content?.enabled === false) {
    return null;
  }

  const strengths = (content?.strengths || []).filter((item) => item.enabled !== false);
  const benefits = (content?.benefits || []).filter((item) => item.enabled !== false);

  return (
    <section className="bg-white py-12 sm:py-16" data-reveal="up">
      <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] gap-7 sm:w-[min(1180px,calc(100%-32px))] sm:gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-lg bg-primary p-5 text-white shadow-2xl shadow-primary/15 sm:p-10" data-reveal="left">
          <img className="absolute inset-0 h-full w-full object-cover opacity-35" src={content?.image} alt={`${plainText(content?.panelTitle || content?.title, "Zumar Law Firm")} background`} loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/65" />
          <div className="relative z-10">
            <h2 className="max-w-xl text-2xl font-black leading-tight sm:text-4xl">
              {content?.panelTitle && <RichContent content={content.panelTitle} inline />}
            </h2>
            <div className="mt-7 grid gap-5 sm:mt-10 sm:gap-7">
              {strengths.map((item, index) => (
                <div key={`${item.label || "strength"}-${index}`}>
                  <div className="mb-3 flex items-center justify-between gap-4 text-sm font-black sm:text-base">
                    <span>{item.label && <RichContent content={item.label} inline />}</span>
                    <span className="text-secondary">{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/25">
                    <div className="h-full rounded-full bg-secondary shadow-[0_0_18px_rgba(239,218,199,0.45)]" style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:pl-4" data-reveal="right">
          <p className="mb-4 inline-flex border-b-2 border-secondary pb-2 text-sm font-black text-primary">
            {content?.eyebrow && <RichContent content={content.eyebrow} inline />}
          </p>
          <h2 className="max-w-2xl text-2xl font-black leading-tight text-ink sm:text-4xl">
            {content?.title && <RichContent content={content.title} inline />}
          </h2>
          <div className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:mt-6 sm:text-base sm:leading-8">
            {content?.copy && <RichContent content={content?.copy} />}
          </div>

          <div className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {benefits.map((item, index) => (
              <div className="flex items-center gap-3 text-sm font-bold text-ink/75" key={`${item.text || "benefit"}-${index}`}>
                <span className="grid size-5 shrink-0 place-items-center rounded border border-primary/20 bg-secondary/60 text-primary">
                  <FaIcon className="size-3" name={item.icon || "check"} />
                </span>
                {item.text && <RichContent content={item.text} inline />}
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-primary/90" href={content?.primaryHref || "/contact"}>
              {content?.primaryLabel}
            </SmartLink>
            <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-md border border-primary/15 bg-white px-6 text-sm font-black text-primary transition hover:-translate-y-1 hover:bg-secondary" href={content?.secondaryHref || "/services"}>
              {content?.secondaryLabel}
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeProcessSection({ section, steps = [] }) {
  return <ProcessSection section={section} steps={steps} />;
}

export function HomeServicesSection({ section, services, categories }) {
  if (section?.enabled === false) {
    return null;
  }

  return (
    <section className="my-10 py-5 sm:py-10" id="services" data-reveal="up">
      <div className="mx-auto w-[min(1180px,calc(100%-24px))] sm:w-[min(1180px,calc(100%-32px))]">
        <div className="mb-7 max-w-3xl sm:mb-10" data-reveal="up">
          <p className="mb-3 text-sm font-black uppercase text-primary">{section?.eyebrow && <RichContent content={section.eyebrow} inline />}</p>
          <h2 className="text-3xl font-black leading-tight text-primary sm:text-6xl">
            {section?.title && <RichContent content={section.title} inline />}
          </h2>
        </div>
        <ServiceBrowser limit={6} showAllButton services={services} categories={categories} />
      </div>
    </section>
  );
}

export function HomeServiceAreasSection({ content, serviceAreas = [] }) {
  if (content?.enabled === false) {
    return null;
  }

  return (
    <section className="my-10 bg-paper py-5 sm:py-10" data-reveal="up">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-reveal="up">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-primary">{content?.eyebrow && <RichContent content={content.eyebrow} inline />}</p>
            <h2 className="text-4xl font-black leading-tight text-primary sm:text-6xl">{content?.title && <RichContent content={content.title} inline />}</h2>
          </div>
          <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white" href={content?.buttonHref || "/service-areas"}>
            {content?.buttonText && <RichContent content={content.buttonText} inline />}
          </SmartLink>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {serviceAreas.filter((area) => area.enabled !== false).slice(0, Number(content?.limit || 4)).map((area) => (
            <Link className="group overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-xl shadow-primary/5 transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15" href={`/service-areas/${area.slug}`} key={area.slug} prefetch={false}>
              <img className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" src={area.image} alt={`${plainText(area.title, "Service area")} services`} loading="lazy" decoding="async" />
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <FaIcon className="size-7 text-primary" name={area.icon || "landmark"} />
                  {area.province ? <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-primary">{area.province}</span> : null}
                </div>
                {area.title ? <RichContent as="h3" className="text-xl font-black text-primary rich-content-compact rich-content-clamp-2" content={area.title} /> : null}
                <div className="mt-3 text-sm leading-6 text-muted">{area.summary && <RichContent className="rich-content-compact rich-content-clamp-3" content={area.summary} />}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeTestimonialsSection({ content }) {
  if (content?.enabled === false) {
    return null;
  }

  const testimonials = (content?.items || []).filter((item) => item.enabled !== false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#37152a] py-14 text-white sm:py-20" data-reveal="up">
      <div className="absolute left-[-8rem] top-[-8rem] size-72 rounded-full bg-secondary/10" />
      <div className="absolute bottom-[-10rem] right-[-6rem] size-80 rounded-full bg-white/10" />
      <div className="relative z-10 mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="mx-auto mb-10 max-w-3xl text-center" data-reveal="up">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-secondary">{content?.eyebrow && <RichContent content={content.eyebrow} inline />}</p>
          <h2 className="text-4xl font-black leading-tight sm:text-6xl">{content?.title && <RichContent content={content.title} inline />}</h2>
          <div className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/72">
            {content?.copy && <RichContent content={content?.copy} className="prose-invert" />}
          </div>
        </div>

        <TestimonialCarousel items={testimonials} />
      </div>
    </section>
  );
}

export function HomeUpdatesSection({ content, newsItems = [], blogPosts = [] }) {
  if (content?.enabled === false) {
    return null;
  }

  return (
    <section className="my-10 py-5 sm:py-10" data-reveal="up">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <ArticlePreviewColumn
          eyebrow={content?.blogEyebrow}
          title={content?.blogTitle}
          linkText={content?.blogButtonText}
          linkHref={content?.blogButtonHref || "/blog"}
          items={blogPosts}
          basePath="/blog"
        />
      </div>
    </section>
  );
}

export function HomeBranchesSection({ content, branches = [] }) {
  if (content?.enabled === false) {
    return null;
  }

  return (
    <section className="bg-primary py-5 text-white sm:py-10" data-reveal="up">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-reveal="up">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-secondary">{content?.eyebrow && <RichContent content={content.eyebrow} inline />}</p>
            <h2 className="text-4xl font-black leading-tight sm:text-6xl">{content?.title && <RichContent content={content.title} inline />}</h2>
          </div>
          <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-6 text-sm font-black text-primary" href={content?.buttonHref || "/branches"}>
            {content?.buttonText && <RichContent content={content.buttonText} inline />}
          </SmartLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {branches.filter((branch) => branch.enabled !== false).slice(0, Number(content?.limit || 2)).map((branch) => (
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-xl shadow-black/10 transition hover:-translate-y-1" key={branch.slug}>
              <Link className="block" href={`/branches/${branch.slug}`} prefetch={false}>
                <img className="h-56 w-full object-cover" src={branch.image} alt={`${plainText(branch.name, "Zumar Law Firm")} branch office`} loading="lazy" decoding="async" />
              </Link>
              <div className="p-6">
                <Link className="inline-flex items-center gap-3 text-xl font-black transition hover:text-secondary" href={`/branches/${branch.slug}`} prefetch={false}>
                  <FaIcon className="size-5 text-secondary" name="landmark" />
                  {branch.name && <RichContent content={branch.name} inline />}
                </Link>
                <p className="mt-4 text-white/75">{branch.phone}</p>
                <p className="text-white/75">{branch.email}</p>
                <a className="mt-3 inline-flex items-start gap-2 leading-7 text-white/75 transition hover:text-secondary" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
                  <FaIcon className="mt-1 size-4 shrink-0 text-secondary" name="globe" />
                  <span>{branch.address && <RichContent content={branch.address} inline />}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeYoutubeSection({ content }) {
  if (content?.enabled === false) {
    return null;
  }

  const videos = (content?.items || []).filter((item) => item.enabled !== false && item.embedUrl);

  if (!videos.length) {
    return null;
  }

  return (
    <section className="bg-primary py-0 text-white" data-reveal="up">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-16">
        <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-secondary">{content?.eyebrow && <RichContent content={content.eyebrow} inline />}</p>
            <h2 className="text-4xl font-black leading-tight sm:text-6xl">{content?.title && <RichContent content={content.title} inline />}</h2>
            <div className="mt-5 text-base leading-8 text-white/70 sm:text-lg">
              {content?.copy && <RichContent content={content?.copy} />}
            </div>
          </div>
          <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-6 text-sm font-black text-primary transition hover:-translate-y-1 hover:bg-white" href={content?.channelHref || "https://www.youtube.com/@zumarlawfirm"}>
            {content?.channelLabel ? <RichContent content={content.channelLabel} inline /> : "Visit Channel"}
          </SmartLink>
        </div>
        <YoutubeVideoCarousel videos={videos} />
      </div>
    </section>
  );
}

export function HomeFaqSection({ content }) {
  if (content?.enabled === false) {
    return null;
  }

  const items = (content?.items || []).filter((item) => item.enabled !== false);

  if (!items.length) {
    return null;
  }

  return (
    <section className="bg-paper py-12 sm:py-16" id="faq" data-reveal="up">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{content?.eyebrow ? <RichContent content={content.eyebrow} inline /> : "FAQ"}</p>
          <h2 className="text-3xl font-black leading-tight text-primary sm:text-5xl">{content?.title ? <RichContent content={content.title} inline /> : "Frequently asked questions."}</h2>
          {content?.copy ? (
            <div className="mt-5 text-base leading-8 text-muted">
              <RichContent content={content.copy} />
            </div>
          ) : null}
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}

function ArticlePreviewColumn({ eyebrow, title, linkText, linkHref, items, basePath }) {
  return (
    <div data-reveal="up">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-primary">{eyebrow && <RichContent content={eyebrow} inline />}</p>
          <h2 className="text-4xl font-black text-primary">{title && <RichContent content={title} inline />}</h2>
        </div>
        <SmartLink className="font-black text-primary" href={linkHref}>{linkText && <RichContent content={linkText} inline />}</SmartLink>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <Link className="overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white shadow-lg shadow-primary/5 transition hover:-translate-y-1" href={`${basePath}/${item.slug}`} key={item.slug} prefetch={false}>
            <img className="h-56 w-full object-cover" src={item.image} alt={plainText(item.title, "Zumar Law Firm update")} loading="lazy" decoding="async" />
            <div className="p-4">
              <p className="text-xs font-black uppercase text-primary/60">{item.date}</p>
              {item.title ? <RichContent as="h3" className="mt-2 text-xl font-black text-primary rich-content-compact rich-content-clamp-2" content={item.title} /> : null}
              <div className="mt-2 text-sm leading-6 text-muted">{item.summary && <RichContent className="rich-content-compact rich-content-clamp-3" content={item.summary} />}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SmartLink({ href, className, children }) {
  const value = href || "/";
  const isExternal = /^https?:\/\//i.test(value);

  if (isExternal) {
    return <a className={className} href={value} target="_blank" rel="noreferrer">{children}</a>;
  }

  return <Link className={className} href={value} prefetch={false}>{children}</Link>;
}

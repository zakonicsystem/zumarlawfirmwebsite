import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import { findBySlug, readCmsData } from "@/lib/cmsStore";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { serviceAreas } = await readCmsData();
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { serviceAreas } = await readCmsData();
  const area = findBySlug(serviceAreas, slug);
  return area ? { title: area.title, description: area.summary } : {};
}

function matchingServices(area, services) {
  if (Array.isArray(area.relatedCategories) && area.relatedCategories.length > 0) {
    return services.filter((service) => area.relatedCategories.includes(service.category)).slice(0, 8);
  }

  if (area.slug.includes("tax")) {
    return services.filter((service) => ["NTN", "Sales Tax", "Income Tax"].includes(service.category)).slice(0, 8);
  }

  if (area.slug.includes("corporate")) {
    return services.filter((service) => service.category === "Company Reg").slice(0, 8);
  }

  if (area.slug.includes("intellectual")) {
    return services.filter((service) => service.category === "Intellectual Property");
  }

  return services.filter((service) => ["NTN", "Sales Tax", "Income Tax", "Company Reg", "Intellectual Property", "Regulatory & Licensing", "Import Export"].includes(service.category)).slice(0, 8);
}

export default async function ServiceAreaDetailPage({ params }) {
  const { slug } = await params;
  const { pageContent, serviceAreas, services } = await readCmsData();
  const area = findBySlug(serviceAreas, slug);
  const page = pageContent.serviceAreaDetail || {};

  if (!area) {
    notFound();
  }

  const related = matchingServices(area, services.filter((service) => service.enabled !== false));

  return (
    <>
      <section className="border-b border-primary/10 bg-gradient-to-br from-paper via-white to-secondary/60 py-14 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="min-w-0">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase text-primary">
              <FaIcon className="size-4" name={area.icon || "landmark"} />
              {page.eyebrow || "Service Area"}
            </p>
            <h1 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{area.title}</h1>
            {area.province ? <p className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-primary shadow-lg shadow-primary/5">{area.province}</p> : null}
            <p className="mt-5 text-lg leading-8 text-muted">{area.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white" href={page.appointmentHref || "/appointment"}>
                <FaIcon className="mr-2 size-4" name="appointment" />
                {page.appointmentLabel || "Book Appointment"}
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/15 bg-white px-6 text-sm font-black text-primary" href="/service-areas">
                <FaIcon className="mr-2 size-4" name="arrowLeft" />
                {page.allAreasLabel || "All Service Areas"}
              </Link>
            </div>
          </div>
          <img className="h-72 w-full rounded-[2rem] object-cover shadow-2xl shadow-primary/10 sm:h-80" src={area.image || "/images/zumar-logo.webp"} alt={area.title} />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-xl shadow-primary/5 sm:p-8">
            <FaIcon className="mb-5 size-8 text-primary" name="globe" />
            <h2 className="text-3xl font-black text-primary">{page.coverageTitle || "How we support this city"}</h2>
            <p className="mt-4 leading-8 text-muted">{area.coverage || page.coverageFallback || area.summary}</p>
          </div>
          <div className="rounded-3xl bg-primary p-6 text-white shadow-2xl shadow-primary/15 sm:p-8">
            <p className="text-sm font-black uppercase text-secondary">Available support</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Online consultation", "Document review", "FBR and SECP filing", "Follow-up and compliance"].map((item) => (
                <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 font-bold" key={item}>
                  <FaIcon className="mt-1 size-4 shrink-0 text-secondary" name="check" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-14 sm:py-20">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <h2 className="mb-8 text-3xl font-black text-primary sm:text-4xl">{page.relatedTitle || "Related Services"}</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {related.map((service) => (
              <Link className="rounded-[1.5rem] border border-primary/10 bg-white p-5 shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10" href={`/services/${service.slug}`} key={service.slug}>
                <FaIcon className="mb-5 size-7 text-primary" name={service.icon} />
                <h3 className="font-black text-primary">{service.title}</h3>
                <p className="mt-3 text-sm font-bold text-muted">{service.formattedPrice}</p>
              </Link>
            ))}
          </div>
          {related.length === 0 ? <p className="rounded-2xl bg-white p-5 font-bold text-muted">Related services will appear here after categories are selected in the admin panel.</p> : null}
        </div>
      </section>
    </>
  );
}

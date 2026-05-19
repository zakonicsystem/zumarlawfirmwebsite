import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import { findBySlug, readCmsData } from "@/lib/cmsStore";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

  return services.filter((service) => ["PSEB Reg", "Regulatory & Licensing", "Chamber of Commerce", "Professional Registration", "Labour Registration", "Import Export"].includes(service.category)).slice(0, 8);
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
      <section className="border-b border-primary/10 bg-gradient-to-br from-paper via-white to-secondary/60 py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase text-primary">
              <FaIcon className="size-4" name={area.icon} />
              {page.eyebrow || "Service Area"}
            </p>
            <h1 className="text-5xl font-black leading-tight text-primary sm:text-5xl">{area.title}</h1>
            <p className="mt-5 text-lg leading-8 text-muted">{area.summary}</p>
          </div>
          <img className="h-80 w-full rounded-[2rem] object-cover shadow-2xl shadow-primary/10" src={area.image} alt={area.title} />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <h2 className="mb-8 text-4xl font-black text-primary">{page.relatedTitle || "Related Services"}</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {related.map((service) => (
              <Link className="rounded-[1.5rem] border border-primary/10 bg-white p-5 shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10" href={`/services/${service.slug}`} key={service.slug}>
                <FaIcon className="mb-5 size-7 text-primary" name={service.icon} />
                <h3 className="font-black text-primary">{service.title}</h3>
                <p className="mt-3 text-sm font-bold text-muted">{service.formattedPrice}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

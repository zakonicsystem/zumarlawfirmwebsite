import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import Link from "next/link";

export async function generateMetadata() {
  return getPageMetadata("serviceAreas");
}

export default async function ServiceAreasPage() {
  const { serviceAreas, pageContent } = await readCmsData();
  const page = pageContent.serviceAreas;
  const visibleAreas = serviceAreas.filter((area) => area.enabled !== false);
  const provinces = [...new Set(visibleAreas.map((area) => area.province).filter(Boolean))];

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="bg-paper py-12 sm:py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 md:grid-cols-3">
          {[
            ["Pakistan Coverage", `${visibleAreas.length}+ cities listed`],
            ["Remote Filing", "Online document handling"],
            ["Branch Support", "Lahore and Islamabad offices"]
          ].map(([title, copy]) => (
            <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-xl shadow-primary/5" key={title}>
              <FaIcon className="mb-4 size-7 text-primary" name={title.includes("Pakistan") ? "globe" : title.includes("Branch") ? "landmark" : "filing"} />
              <h2 className="text-xl font-black text-primary">{title}</h2>
              <p className="mt-2 font-bold text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          {provinces.length ? (
            <div className="mb-8 flex flex-wrap gap-2">
              {provinces.map((province) => (
                <span className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-primary" key={province}>{province}</span>
              ))}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleAreas.map((area) => (
              <Link className="group min-w-0 overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-xl shadow-primary/5 transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15" href={`/service-areas/${area.slug}`} key={area.slug}>
                <div className="relative">
                  <img className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" src={area.image || "/images/zumar-logo.webp"} alt={area.title} />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-primary shadow-lg shadow-primary/10">{area.province || "Pakistan"}</span>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <FaIcon className="size-5" name={area.icon || "landmark"} />
                    </span>
                    <h2 className="text-2xl font-black leading-tight text-primary">{area.title}</h2>
                  </div>
                  <p className="leading-7 text-muted">{area.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
                    View city services
                    <FaIcon className="size-3.5 transition group-hover:translate-x-1" name="arrowRight" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {visibleAreas.length === 0 ? (
            <p className="rounded-3xl bg-paper p-6 font-bold text-muted">No service areas are currently published.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}

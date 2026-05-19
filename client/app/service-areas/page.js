import ArticleCard from "@/components/ArticleCard";
import PageHeader from "@/components/PageHeader";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("serviceAreas");
}

export default async function ServiceAreasPage() {
  const { serviceAreas, pageContent } = await readCmsData();
  const page = pageContent.serviceAreas;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 md:grid-cols-2">
          {serviceAreas.map((area) => (
            <ArticleCard item={area} href={`/service-areas/${area.slug}`} key={area.slug} label="View Area" icon={area.icon} />
          ))}
        </div>
      </section>
    </>
  );
}

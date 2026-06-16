import ServiceBrowser from "@/components/ServiceBrowser";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import { toServiceCards } from "@/lib/serviceCards";

export async function generateMetadata() {
  return getPageMetadata("services");
}

export default async function ServicesPage() {
  const { services, categories, pageContent } = await readCmsData();
  const page = pageContent.services;
  const visibleServices = toServiceCards(services.filter((service) => service.enabled !== false));

  return (
    <>
      <section className="border-b border-primary/10 bg-gradient-to-br from-paper via-white to-secondary/60 py-10 sm:py-20">
        <div className="mx-auto w-[min(1180px,calc(100%-24px))] sm:w-[min(1180px,calc(100%-32px))]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase text-primary">
              <FaIcon className="size-4" name="search" />
              {page.eyebrow && <RichContent content={page.eyebrow} inline />}
            </p>
            <h1 className="text-3xl font-black leading-tight text-primary sm:text-5xl">{page.title && <RichContent content={page.title} inline />}</h1>
            <div className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:mt-5 sm:text-lg sm:leading-8">
              {page.copy && <RichContent content={page.copy} />}
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 sm:py-20">
        <div className="mx-auto w-[min(1180px,calc(100%-24px))] sm:w-[min(1180px,calc(100%-32px))]">
          <ServiceBrowser services={visibleServices} categories={categories} />
        </div>
      </section>
    </>
  );
}

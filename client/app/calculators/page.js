import PageHeader from "@/components/PageHeader";
import TaxCalculators from "@/components/TaxCalculators";
import FaqAccordion from "@/components/FaqAccordion";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { generateOrganizationSchema, generateFAQSchema } from "@/lib/schema";

export async function generateMetadata() {
  return getPageMetadata("calculators");
}

export default async function CalculatorsPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.calculators;
  const faqItems = (page.faqItems || []).filter((item) => item.enabled !== false);

  return (
    <>
      <JsonLd schema={generateOrganizationSchema()} />
      {faqItems.length ? <JsonLd schema={generateFAQSchema(faqItems, "https://zumarlawfirm.com/calculators")} /> : null}
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <TaxCalculators page={page} />
      
      {faqItems.length ? (
        <section className="overflow-hidden bg-[#fffdfb] py-14 sm:py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{page.faqEyebrow || "Common Questions"}</p>
              <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">{page.faqTitle || "Tax calculator questions answered"}</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      ) : null}
    </>
  );
}

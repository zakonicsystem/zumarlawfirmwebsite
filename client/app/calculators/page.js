import PageHeader from "@/components/PageHeader";
import TaxCalculators from "@/components/TaxCalculators";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("calculators");
}

export default async function CalculatorsPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.calculators;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <TaxCalculators page={page} />
    </>
  );
}

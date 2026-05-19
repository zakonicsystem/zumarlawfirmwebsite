import PageHeader from "@/components/PageHeader";
import TaxCalculators from "@/components/TaxCalculators";
import { readCmsData } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Business Tax Calculator",
  description: "Estimate Pakistan business income tax with Zumar Law Firm."
};

export default async function BusinessTaxCalculatorPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.calculators;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.businessTitle} copy={page.businessCopy} />
      <TaxCalculators page={page} mode="business" />
    </>
  );
}

import PageHeader from "@/components/PageHeader";
import TaxCalculators from "@/components/TaxCalculators";
import { readCmsData } from "@/lib/cmsStore";

export const metadata = {
  title: "Salary Tax Calculator",
  description: "Estimate Pakistan salary tax with Zumar Law Firm."
};

export default async function SalaryTaxCalculatorPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.calculators;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.salaryTitle} copy={page.salaryCopy} />
      <TaxCalculators page={page} mode="salary" />
    </>
  );
}

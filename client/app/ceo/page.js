import CeoHistory from "@/components/CeoHistory";
import PageHeader from "@/components/PageHeader";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("ceo");
}

export default async function CeoPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.team;

  return (
    <>
      <PageHeader eyebrow={page.ceoEyebrow} title={page.ceoName} copy={page.ceoBio} />
      <CeoHistory page={page} />
    </>
  );
}

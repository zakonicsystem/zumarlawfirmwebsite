import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("refundPolicy");
}

export default async function RefundPolicyPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.refundPolicy;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy="" />
      <section className="py-16 sm:py-20">
        <div className="mx-auto rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:w-[min(900px,calc(100%-32px))] sm:p-10">
          <p className="text-lg leading-8 text-ink/75">
            {page.copy}
          </p>
          {(page.sections || []).map((section, index) => (
            <div key={`${section.title || "section"}-${index}`}>
              <h2 className="mt-9 inline-flex items-center gap-3 text-3xl font-black text-primary">
                <FaIcon className="size-6" name={section.icon} />
                {section.title}
              </h2>
              <p className="mt-3 text-lg leading-8 text-ink/75">{section.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

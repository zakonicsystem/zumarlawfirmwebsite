import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getPageMetadata("privacyPolicy");
}

export default async function PrivacyPolicyPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.privacyPolicy;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy="" />
      <section className="py-16 sm:py-20">
        <div className="mx-auto rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:w-[min(900px,calc(100%-32px))] sm:p-10">
          <div className="text-lg leading-8 text-ink/75">
            {page.copy && <RichContent content={page.copy} />}
          </div>
          {(page.sections || []).map((section, index) => (
            <div key={`${section.title || "section"}-${index}`}>
              <h2 className="mt-9 inline-flex items-center gap-3 text-3xl font-black text-primary">
                <FaIcon className="size-6" name={section.icon} />
                {section.title && <RichContent content={section.title} inline />}
              </h2>
              <div className="mt-3 text-lg leading-8 text-ink/75">{section.copy && <RichContent content={section.copy} />}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

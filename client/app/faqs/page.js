import PageHeader from "@/components/PageHeader";
import FaqAccordion from "@/components/FaqAccordion";
import FaIcon from "@/components/FaIcon";
import Reveal from "@/components/Reveal";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getPageMetadata("faqs");
}

export default async function FaqPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.faqs;

  return (
    <>
      <Reveal />
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="bg-[#fffdfb] py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="rounded-[2rem] bg-primary p-7 text-white shadow-2xl shadow-primary/20 lg:sticky lg:top-8" data-reveal="left">
            <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
              <FaIcon className="size-7" name="faq" />
            </span>
            <h2 className="mt-6 text-3xl font-black leading-tight">{page.sideTitle}</h2>
            <p className="mt-4 leading-8 text-white/72">
              {page.sideCopy}
            </p>
            <div className="mt-7 grid gap-3 text-sm font-bold text-white/82">
              <p className="inline-flex items-center gap-3">
                <FaIcon className="size-4 text-secondary" name="phone" />
                {page.sidePhone}
              </p>
              <p className="inline-flex items-center gap-3">
                <FaIcon className="size-4 text-secondary" name="email" />
                {page.sideEmail}
              </p>
            </div>
          </aside>

          <div data-reveal="right">
            <FaqAccordion items={(page.items || []).slice(0, 10)} />
          </div>
        </div>
      </section>
    </>
  );
}

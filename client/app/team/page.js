import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("team");
}

export default async function TeamPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.team;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(page.members || []).filter((member) => member.enabled !== false).map((member) => (
            <article className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-xl shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10" key={member.name}>
              <img className="h-72 w-full object-cover" src={member.image} alt={member.name} />
              <div className="p-6">
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase text-primary/60">
                  <FaIcon className="size-3.5" name="headset" />
                  {member.designation || member.role}
                </p>
                <h2 className="text-2xl font-black text-primary">{member.name}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

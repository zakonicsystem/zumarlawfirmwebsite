import PageHeader from "@/components/PageHeader";
import TeamMemberCard from "@/components/TeamMemberCard";
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
            <TeamMemberCard member={member} key={member.name} />
          ))}
        </div>
      </section>
    </>
  );
}

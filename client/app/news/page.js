import ArticleCard from "@/components/ArticleCard";
import PageHeader from "@/components/PageHeader";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("news");
}

export default async function NewsPage() {
  const { news, pageContent } = await readCmsData();
  const page = pageContent.news;
  const visibleNews = news.filter((item) => item.enabled !== false);

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleNews.map((item) => (
            <ArticleCard item={item} href={`/news/${item.slug}`} key={item.slug} label="Open News" icon="filing" />
          ))}
        </div>
      </section>
    </>
  );
}

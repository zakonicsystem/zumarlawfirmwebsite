import ArticleCard from "@/components/ArticleCard";
import PageHeader from "@/components/PageHeader";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { generateOrganizationSchema } from "@/lib/schema";

export async function generateMetadata() {
  return getPageMetadata("blog");
}

export default async function BlogPage() {
  const { blogs, pageContent } = await readCmsData();
  const page = pageContent.blog;
  const visibleBlogs = blogs.filter((post) => post.enabled !== false);

  return (
    <>
      <JsonLd schema={generateOrganizationSchema()} />
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleBlogs.map((post) => (
            <ArticleCard item={post} href={`/blog/${post.slug}`} key={post.slug} label="Read Blog" icon="certificate" />
          ))}
        </div>
      </section>
    </>
  );
}

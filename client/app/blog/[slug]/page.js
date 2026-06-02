import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import { findBySlug, readCmsData } from "@/lib/cmsStore";
import { getRecordMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { blogs } = await readCmsData();
  return blogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { blogs } = await readCmsData();
  const post = findBySlug(blogs, slug);
  return post ? getRecordMetadata(post) : {};
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const { blogs } = await readCmsData();
  const post = findBySlug(blogs, slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="border-b border-primary/10 bg-gradient-to-br from-paper via-white to-secondary/60 py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase text-primary">
              <FaIcon className="size-4" name="certificate" />
              Blog | {post.date}
            </p>
            <h1 className="text-5xl font-black leading-tight text-primary sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-lg leading-8 text-muted">{post.summary}</p>
          </div>
          <img className="h-80 w-full rounded-[2rem] object-cover shadow-2xl shadow-primary/10" src={post.image} alt={post.title} />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <article className="mx-auto rounded-[2rem] border border-primary/10 bg-white p-7 text-lg leading-8 text-ink/75 shadow-xl shadow-primary/5 sm:w-[min(900px,calc(100%-32px))] sm:p-10">
          <p>{post.body || post.summary}</p>
          <Link className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white" href="/blog">
            <FaIcon className="mr-2 size-4" name="arrowLeft" />
            Back to Blog
          </Link>
        </article>
      </section>
    </>
  );
}

import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import PageHeader from "@/components/PageHeader";
import RichContent from "@/components/RichContent";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import { plainText } from "@/lib/text";

export async function generateMetadata() {
  return getPageMetadata("branches");
}

export default async function BranchesPage() {
  const { branches, pageContent } = await readCmsData();
  const page = pageContent.branches;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 md:grid-cols-2">
          {branches.map((branch) => (
            <article className="group overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-xl shadow-primary/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15" key={branch.slug}>
              <Link className="block overflow-hidden" href={`/branches/${branch.slug}`}>
                <img className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" src={branch.image} alt={`${plainText(branch.name, "Zumar Law Firm")} branch office`} />
              </Link>
              <div className="p-6">
                <h2 className="text-2xl font-black leading-tight text-primary">{branch.name && <RichContent content={branch.name} inline />}</h2>
                <a className="mt-4 inline-flex min-w-0 items-start gap-3 rounded-2xl bg-paper/70 p-4 leading-7 text-muted transition hover:bg-secondary/60 hover:text-primary" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
                  <FaIcon className="mt-1 size-4 shrink-0 text-primary" name="landmark" />
                  <span className="break-words">{branch.address && <RichContent content={branch.address} inline />}</span>
                </a>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-5 text-sm font-black text-primary" href={`/branches/${branch.slug}`}>
                    <FaIcon className="size-4" name="landmark" />
                    View Branch
                  </Link>
                  <a className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/10 px-5 text-sm font-black text-primary" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
                    <FaIcon className="size-4" name="globe" />
                    Open Map
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

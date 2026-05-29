import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

const contactImage = "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=85";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("contact");
}

export default async function ContactPage() {
  const { pageContent } = await readCmsData();
  const page = pageContent.contact;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} copy={page.copy} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-xl shadow-primary/10">
              <img className="h-80 w-full object-cover object-top sm:h-[420px]" src={page.image || contactImage} alt="Zumar Law Firm contact support" loading="lazy" decoding="async" />
            </div>
            {(page.links || []).map((link, index) => (
              <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-lg shadow-primary/5" key={`${link.title || "link"}-${index}`}>
                <strong className="inline-flex items-center gap-2 text-lg font-black text-primary">
                  <FaIcon className="size-4" name={link.icon} />
                  {link.title}
                </strong>
                <a
                  className="mt-2 block font-semibold text-muted transition hover:text-primary"
                  href={link.href}
                  target={isExternalUrl(link.href) ? "_blank" : undefined}
                  rel={isExternalUrl(link.href) ? "noreferrer" : undefined}
                >
                  {link.text}
                </a>
              </div>
            ))}
          </div>

          <form className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-2xl shadow-primary/10 sm:p-9">
            <h2 className="inline-flex items-center gap-3 text-3xl font-black text-primary">
              <FaIcon className="size-6" name="headset" />
              {page.formTitle}
            </h2>
            <p className="mt-4 leading-8 text-muted">
              {page.formCopy}
            </p>
            <div className="mt-6 grid gap-3">
              <input className="min-h-14 rounded-2xl border border-primary/10 bg-paper px-5 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10" name="name" placeholder="Full name" />
              <input className="min-h-14 rounded-2xl border border-primary/10 bg-paper px-5 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10" name="email" placeholder="Email address" type="email" />
              <input className="min-h-14 rounded-2xl border border-primary/10 bg-paper px-5 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10" name="phone" placeholder="Phone number" />
              <textarea className="min-h-36 rounded-2xl border border-primary/10 bg-paper p-5 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10" name="message" placeholder="How can we help?" />
              <button className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-primary/90" type="button">
                <FaIcon className="mr-2 size-4" name="email" />
                Send Inquiry
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function isExternalUrl(value = "") {
  return /^https?:\/\//i.test(value);
}

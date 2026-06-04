import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import { policyLinks, quickLinks } from "@/lib/services";
import { readCmsData } from "@/lib/cmsStore";

export default async function Footer() {
  const { branches, categories, serviceAreas, settings } = await readCmsData();
  const serviceGroups = categories.slice(0, 7);
  const footerAreas = (serviceAreas || []).filter((area) => area.enabled !== false).slice(0, 8);
  const socialLinks = (settings?.socialLinks || []).filter((link) => link.enabled !== false && link.href);

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_1.15fr]">
          <div>
            <img className="mb-5 rounded-2xl bg-white p-2 object-contain" src="/images/zumar-logo.webp" alt="Zumar Law Firm logo" />

            <p className="mt-4 max-w-sm leading-7 text-white/75">
              Clean, accountable support for tax filings, company registration, licensing,
              intellectual property, and regulatory compliance across Pakistan.
            </p>
            {socialLinks.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 px-3 text-xs font-black uppercase text-white/75 transition hover:border-secondary hover:bg-secondary hover:text-primary" href={link.href} key={link.label} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h4 className="mb-4 font-extrabold">Services</h4>
            <div className="grid gap-2 text-sm font-semibold text-white/70">
              {serviceGroups.map((category) => (
                <Link className="inline-flex items-center gap-2 transition-colors hover:text-secondary" key={category} href={`/services?category=${encodeURIComponent(category)}`}>
                  <FaIcon className="size-3.5" name="scale" />
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-extrabold">Quick Links</h4>
            <div className="grid gap-2 text-sm font-semibold text-white/70">
              {quickLinks.map((link) =>
                link.href.startsWith("http") ? (
                  <a className="inline-flex items-center gap-2 transition-colors hover:text-secondary" key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    <FaIcon className="size-3.5" name={link.title.includes("Account") ? "registration" : "lock"} />
                    {link.title}
                  </a>
                ) : (
                  <Link className="inline-flex items-center gap-2 transition-colors hover:text-secondary" key={link.href} href={link.href}>
                    <FaIcon className="size-3.5" name={link.href.includes("appointment") ? "appointment" : link.href.includes("contact") ? "phone" : link.href.includes("careers") ? "business" : link.href.includes("faqs") ? "faq" : "landmark"} />
                    {link.title}
                  </Link>
                )
              )}
              <Link className="inline-flex items-center gap-2 transition-colors hover:text-secondary" href="/calculators">
                <FaIcon className="size-3.5" name="tax" />
                Tax Calculators
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-extrabold">Policies</h4>
            <div className="grid gap-2 text-sm font-semibold text-white/70">
              {policyLinks.map((link) => (
                <Link className="inline-flex items-center gap-2 transition-colors hover:text-secondary" key={link.href} href={link.href}>
                  <FaIcon className="size-3.5" name="filing" />
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-extrabold">Branches</h4>
            <div className="grid gap-4 text-sm text-white/70">
              {branches.map((branch) => (
                <div className="rounded-2xl border border-white/10 p-4 transition hover:border-secondary/50 hover:text-white" key={branch.slug}>
                  <strong className="mb-2 inline-flex items-center gap-2 text-white">
                    <FaIcon className="size-3.5 text-secondary" name="landmark" />
                    <Link className="transition hover:text-secondary" href={`/branches/${branch.slug}`}>{branch.name}</Link>
                  </strong>
                  <span className="block">{branch.phone}</span>
                  <span className="block">{branch.email}</span>
                  <a className="mt-1 inline-flex items-start gap-2 leading-6 transition hover:text-secondary" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
                    <FaIcon className="mt-1 size-3 shrink-0 text-secondary" name="globe" />
                    <span>{branch.address}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-sm text-white/60">
          © {new Date().getFullYear()} Zumar Law Firm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

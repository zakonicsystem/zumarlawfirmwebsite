import AppointmentForm from "@/components/AppointmentForm";
import FaIcon from "@/components/FaIcon";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import RichContent from "@/components/RichContent";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getPageMetadata("appointment");
}

export default async function AppointmentPage() {
  const { branches, pageContent, services } = await readCmsData();
  const page = pageContent.appointment || {};
  const visibleBranches = (branches || []).filter((branch) => branch.enabled !== false);
  const visibleServices = (services || []).filter((service) => service.enabled !== false);

  return (
    <>
      <JsonLd schema={generateAppointmentPageSchema()} />
      <PageHeader eyebrow={page.eyebrow || "Appointment"} title={page.title || "Book an Appointment"} copy={page.copy} />

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-xl shadow-primary/10">
              <img
                className="h-72 w-full object-cover object-center sm:h-[420px]"
                src={page.image || "/images/zumar-law-firm-contact-support.webp"}
                alt="Book an appointment with Zumar Law Firm"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-lg shadow-primary/5">
              <h2 className="inline-flex items-center gap-3 text-2xl font-black text-primary">
                <FaIcon className="size-5" name="appointment" />
                {page.sideTitle ? <RichContent content={page.sideTitle} inline /> : "Before Your Appointment"}
              </h2>
              {page.checklist?.length ? (
                <ul className="mt-5 grid gap-3">
                  {page.checklist.map((item, index) => (
                    <li className="flex items-start gap-3 rounded-2xl bg-paper px-4 py-3 text-sm font-bold leading-6 text-ink/80" key={`${item}-${index}`}>
                      <FaIcon className="mt-1 size-4 shrink-0 text-primary" name="check" />
                      <div className="min-w-0">{item && <RichContent content={item} />}</div>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-primary/90" href={page.startOnlineHref || "https://app.zumarlawfirm.com/signup"} target="_blank" rel="noreferrer">
                  <FaIcon className="mr-2 size-4" name="registration" />
                  {page.startOnlineLabel || "Start Online"}
                </a>
                <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/15 px-5 text-sm font-black text-primary transition hover:-translate-y-1 hover:bg-secondary/40" href={page.contactHref || "tel:+923035988574"}>
                  <FaIcon className="mr-2 size-4" name="phone" />
                  {page.contactLabel || "Call Now"}
                </a>
              </div>
            </div>
          </div>

          <AppointmentForm branches={visibleBranches} services={visibleServices} content={page} />
        </div>
      </section>
    </>
  );
}

function generateAppointmentPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://zumarlawfirm.com/appointment#webpage",
    "name": "Book Appointment with Zumar Law Firm",
    "url": "https://zumarlawfirm.com/appointment",
    "description": "Book an appointment with Zumar Law Firm for tax, company registration, licensing, intellectual property, and legal consultation services.",
    "mainEntity": {
      "@type": "LegalService",
      "@id": "https://zumarlawfirm.com/#organization",
      "name": "Zumar Law Firm",
      "telephone": "+92-303-598-8574",
      "email": "team@zumarlawfirm.com"
    }
  };
}

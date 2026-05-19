import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FaIcon from "@/components/FaIcon";
import AppointmentForm from "@/components/AppointmentForm";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const appointmentImage = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=85";

export async function generateMetadata() {
  return getPageMetadata("appointment");
}

export default async function AppointmentPage() {
  const { services, pageContent } = await readCmsData();
  const page = pageContent.appointment;
  const visibleServices = services.filter((service) => service.enabled !== false).slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        copy={page.copy}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:p-9">
            <div className="mb-7 overflow-hidden rounded-[1.5rem]">
              <img className="h-56 w-full object-cover" src={page.image || appointmentImage} alt="Tax paperwork and calculator from Unsplash" />
            </div>
            <h2 className="inline-flex items-center gap-3 text-3xl font-black text-primary">
              <FaIcon className="size-6" name="appointment" />
              {page.sideTitle}
            </h2>
            <ul className="mt-6 grid gap-3">
              {(page.checklist || []).map((item) => (
                <li className="flex gap-3 rounded-2xl bg-paper px-4 py-3 text-ink/80" key={item}>
                  <FaIcon className="mt-1 size-4 shrink-0 text-primary" name="scale" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1" href={page.startOnlineHref || "https://app.zumarlawfirm.com/signup"}>
                <FaIcon className="mr-2 size-4" name="registration" />
                {page.startOnlineLabel}
              </a>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/15 bg-white px-6 text-sm font-black text-primary transition hover:-translate-y-1 hover:bg-secondary" href={page.contactHref || "/contact"}>
                <FaIcon className="mr-2 size-4" name="phone" />
                {page.contactLabel}
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <AppointmentForm services={visibleServices} content={page} />
            {visibleServices.map((service) => (
              <Link className="group rounded-[1.5rem] border border-primary/10 bg-white p-6 shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10" href={`/services/${service.slug}`} key={service.slug}>
                <div>
                  <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-black text-primary">{service.category}</span>
                  <h3 className="mt-5 inline-flex items-center gap-3 text-2xl font-black text-primary">
                    <FaIcon className="size-5" name={service.icon} />
                    {service.title}
                  </h3>
                  <p className="mt-2 leading-7 text-muted">{service.summary}</p>
                </div>
                <div className="mt-5 font-black text-primary">{service.formattedPrice}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

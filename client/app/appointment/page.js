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
  const { branches, services, pageContent } = await readCmsData();
  const page = pageContent.appointment;
  const visibleServices = services.filter((service) => service.enabled !== false);
  const previewServices = visibleServices.slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        copy={page.copy}
      />
      <section className="py-12 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] min-w-0 gap-6 sm:w-[min(1180px,calc(100%-32px))] sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 rounded-3xl border border-primary/10 bg-white p-5 shadow-xl shadow-primary/5 sm:rounded-[2rem] sm:p-9">
            <div className="mb-7 overflow-hidden rounded-2xl sm:rounded-[1.5rem]">
              <img className="h-56 w-full object-cover" src={page.image || appointmentImage} alt="Tax paperwork and calculator from Unsplash" />
            </div>
            <h2 className="flex min-w-0 items-start gap-3 text-2xl font-black text-primary sm:text-3xl">
              <FaIcon className="mt-1 size-5 shrink-0 sm:size-6" name="appointment" />
              <span className="min-w-0 break-words">{page.sideTitle}</span>
            </h2>
            <ul className="mt-6 grid min-w-0 gap-3">
              {(page.checklist || []).map((item) => (
                <li className="flex min-w-0 gap-3 rounded-2xl bg-paper px-4 py-3 text-ink/80" key={item}>
                  <FaIcon className="mt-1 size-4 shrink-0 text-primary" name="scale" />
                  <span className="min-w-0 break-words">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <a className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1 sm:w-auto" href={page.startOnlineHref || "https://app.zumarlawfirm.com/signup"} target="_blank" rel="noreferrer">
                <FaIcon className="mr-2 size-4" name="registration" />
                {page.startOnlineLabel}
              </a>
              <Link className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-primary/15 bg-white px-6 text-sm font-black text-primary transition hover:-translate-y-1 hover:bg-secondary sm:w-auto" href={page.contactHref || "/contact"}>
                <FaIcon className="mr-2 size-4" name="phone" />
                {page.contactLabel}
              </Link>
            </div>
          </div>
          <div className="grid min-w-0 gap-4">
            <AppointmentForm branches={branches} services={visibleServices} content={page} />
            {previewServices.map((service) => (
              <Link className="group min-w-0 rounded-3xl border border-primary/10 bg-white p-5 shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 sm:rounded-[1.5rem] sm:p-6" href={`/services/${service.slug}`} key={service.slug}>
                <div className="min-w-0">
                  <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-black text-primary">{service.category}</span>
                  <h3 className="mt-5 flex min-w-0 items-start gap-3 text-xl font-black text-primary sm:text-2xl">
                    <FaIcon className="mt-1 size-5 shrink-0" name={service.icon} />
                    <span className="min-w-0 break-words">{service.title}</span>
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

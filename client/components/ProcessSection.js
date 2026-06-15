import Link from "next/link";
import RichContent from "@/components/RichContent";
import { plainText } from "@/lib/text";

export default function ProcessSection({ section, steps = [], className = "my-5" }) {
  if (section?.enabled === false) {
    return null;
  }

  return (
    <section className={`${className} scroll-mt-28 bg-primary py-5 text-white sm:py-10`} id={section?.id || "how-we-work"} data-reveal="up">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div data-reveal="left">
          <p className="mb-3 text-sm font-black uppercase text-secondary">{section?.eyebrow && <RichContent content={section.eyebrow} inline />}</p>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">{section?.title && <RichContent content={section.title} inline />}</h2>
          <div className="mt-6 text-lg leading-8 text-white/70">
            {section?.copy && <RichContent content={section?.copy} />}
          </div>
          {section?.image ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10">
              <img className="h-64 w-full object-cover opacity-90" src={section.image} alt={`${plainText(section?.title, "Business documents")} process image`} />
            </div>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-6 text-sm font-black text-primary transition hover:-translate-y-1 hover:bg-white" href={section?.primaryHref || "/services"}>
              {section?.primaryLabel || "Explore Services"}
            </SmartLink>
            <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10" href={section?.secondaryHref || "/appointment"}>
              {section?.secondaryLabel || "Book Appointment"}
            </SmartLink>
          </div>
        </div>
        <div className="grid gap-4" data-reveal="right">
          {steps.filter((step) => step.enabled !== false).map((step, index) => (
            <div className="group grid gap-5 rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/12 sm:grid-cols-[64px_1fr]" key={`${step.number || step.title || "step"}-${index}`}>
              <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-xl font-black text-primary transition duration-300 group-hover:rotate-3">
                {step.number}
              </span>
              <div>
                <h3 className="text-2xl font-black">{step.title && <RichContent content={step.title} inline />}</h3>
                <div className="mt-2 leading-7 text-white/70">
                  {step.copy && <RichContent content={step.copy} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmartLink({ href = "/", className, children }) {
  const isExternal = /^https?:\/\//i.test(href);

  if (isExternal) {
    return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
  }

  return <Link className={className} href={href} prefetch={false}>{children}</Link>;
}

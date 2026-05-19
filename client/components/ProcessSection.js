export default function ProcessSection({ section, steps = [], className = "my-5" }) {
  if (section?.enabled === false) {
    return null;
  }

  return (
    <section className={`${className} bg-primary py-5 text-white sm:py-10`} data-reveal="up">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div data-reveal="left">
          <p className="mb-3 text-sm font-black uppercase text-secondary">{section?.eyebrow}</p>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">{section?.title}</h2>
          <p className="mt-6 text-lg leading-8 text-white/70">{section?.copy}</p>
          {section?.image ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10">
              <img className="h-64 w-full object-cover opacity-90" src={section.image} alt={section?.title || "Business documents"} />
            </div>
          ) : null}
        </div>
        <div className="grid gap-4" data-reveal="right">
          {steps.filter((step) => step.enabled !== false).map((step, index) => (
            <div className="group grid gap-5 rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/12 sm:grid-cols-[64px_1fr]" key={`${step.number || step.title || "step"}-${index}`}>
              <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-xl font-black text-primary transition duration-300 group-hover:rotate-3">
                {step.number}
              </span>
              <div>
                <h3 className="text-2xl font-black">{step.title}</h3>
                <p className="mt-2 leading-7 text-white/70">{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

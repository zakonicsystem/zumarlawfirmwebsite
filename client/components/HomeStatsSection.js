import FaIcon from "@/components/FaIcon";

export default function HomeStatsSection({ stats = [] }) {
  const visibleStats = stats.filter((item) => item.enabled !== false);

  if (visibleStats.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#fffdfb] pb-10 pt-10 sm:pb-14 sm:pt-14" aria-label="Firm highlights" data-reveal="up">
      <div className="pointer-events-none absolute left-[7%] top-0 hidden h-44 w-8 -translate-y-24 rounded-full bg-primary/5 sm:block" />
      <div className="pointer-events-none absolute left-[10%] top-0 hidden h-52 w-8 -translate-y-32 rounded-full bg-primary/5 sm:block" />
      <div className="pointer-events-none absolute bottom-0 right-[7%] hidden h-40 w-8 translate-y-12 rounded-full bg-primary/5 sm:block" />
      <div className="pointer-events-none absolute bottom-0 right-[10%] hidden h-52 w-8 translate-y-20 rounded-full bg-primary/5 sm:block" />

      <div className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleStats.map((item, index) => (
          <article
            className="group grid min-h-56 place-items-center rounded-lg border border-primary/5 bg-white px-6 py-9 text-center shadow-2xl shadow-primary/8 transition duration-300 hover:-translate-y-2 hover:border-primary/15 hover:shadow-primary/15"
            data-reveal="zoom"
            key={`${item.label}-${index}`}
          >
            <div>
              <span className="mx-auto grid h-28 w-36 place-items-center text-primary transition duration-300 group-hover:scale-110 group-hover:text-secondary">
                <FaIcon className="!h-15 !w-24 text-[5rem]" name={item.icon || "scale"} />
              </span>
              <strong className="mt-4 block text-3xl font-black leading-none text-ink sm:text-3xl">
                {item.value}
              </strong>
              <p className="mt-3 text-sm font-bold text-muted">{item.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

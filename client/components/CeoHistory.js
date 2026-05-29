import FaIcon from "@/components/FaIcon";

export default function CeoHistory({ page }) {
  const bioParagraphs = String(page.ceoBio || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="bg-[#fffdfb] py-16 sm:py-20" id="leadership">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white p-3 shadow-2xl shadow-primary/10">
            <img className="h-[520px] w-full rounded-[1.5rem] bg-white object-contain object-center" src={page.ceoImage} alt={page.ceoName} />
          </div>
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{page.ceoEyebrow}</p>
            <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{page.ceoName}</h2>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-black uppercase text-primary/65">
              <FaIcon className="size-4" name="landmark" />
              {page.ceoRole}
            </p>
            <div className="mt-6 grid gap-5 text-lg leading-8 text-muted">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-20" id="history">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">{page.historyEyebrow}</p>
            <h2 className="text-4xl font-black leading-tight text-primary sm:text-5xl">{page.historyTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{page.historyCopy}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {(page.history || []).map((item) => (
              <article className="rounded-lg border border-primary/10 bg-white p-6 shadow-xl shadow-primary/5" key={`${item.year}-${item.title}`}>
                <p className="text-sm font-black uppercase text-primary/60">{item.year}</p>
                <h3 className="mt-3 text-2xl font-black text-primary">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

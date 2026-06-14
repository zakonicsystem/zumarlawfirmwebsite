import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";

export default function PageHeader({ eyebrow, title, copy }) {
  return (
    <section className="border-b border-primary/10 bg-gradient-to-br from-paper via-white to-secondary/60 py-16 sm:py-20">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <p className="mb-3 inline-flex items-center gap-2 text-2xl font-black uppercase text-primary">
          <FaIcon className="size-4" name="scale" />
          {eyebrow && <RichContent content={eyebrow} inline />}
        </p>
        <h1 className="max-w-4xl text-5xl font-black leading-tight text-primary sm:text-5xl">{title && <RichContent content={title} inline />}</h1>
        {copy ? <div className="mt-5 max-w-3xl text-lg leading-8 text-muted"><RichContent content={copy} /></div> : null}
      </div>
    </section>
  );
}

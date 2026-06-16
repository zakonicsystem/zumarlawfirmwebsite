import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";

export default function FaqAccordion({ items = [] }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <details
          className="group overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white shadow-xl shadow-primary/5 transition duration-300 open:border-primary/25 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10"
          key={`${item.question}-${index}`}
          open={index === 0}
        >
          <summary className="grid cursor-pointer list-none gap-4 p-5 text-left sm:grid-cols-[56px_1fr_auto] sm:items-center sm:p-6 [&::-webkit-details-marker]:hidden">
            <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary transition group-open:bg-primary group-open:text-white">
              <FaIcon className="size-6" name={item.icon || "faq"} />
            </span>
            <span className="text-xl font-black leading-tight text-primary sm:text-2xl">{item.question && <RichContent content={item.question} inline />}</span>
            <span className="grid size-10 place-items-center rounded-full border border-primary/10 bg-white text-primary transition group-open:rotate-45 group-open:bg-secondary">
              +
            </span>
          </summary>

          <div className="border-t border-primary/10 px-5 pb-6 pt-5 sm:ml-[80px] sm:px-6">
            <RichContent as="div" className="text-lg leading-8 text-muted" content={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}

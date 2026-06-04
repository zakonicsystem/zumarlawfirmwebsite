import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";

export default function ArticleCard({ item, href, label = "Read More", icon = "filing" }) {
  return (
    <Link className="group overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-xl shadow-primary/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15" href={href}>
      <img className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" src={item.image} alt={item.title} />
      <div className="p-6">
        {item.date ? <p className="mb-3 text-xs font-black uppercase text-primary/70">{item.date}</p> : null}
        <h2 className="text-2xl font-black leading-tight text-primary">{(item.title || item.name) && <RichContent content={item.title || item.name} />}</h2>
        <div className="mt-3 leading-7 text-muted">{(item.summary || item.address) && <RichContent content={item.summary || item.address} />}</div>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-black text-primary">
          <FaIcon className="size-4" name={icon} />
          {label}
        </span>
      </div>
    </Link>
  );
}

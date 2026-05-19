"use client";

import { useState } from "react";
import FaIcon from "@/components/FaIcon";

export default function FaqAccordion({ items = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const active = open === index;

        return (
          <article
            className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-xl shadow-primary/5 transition duration-300 ${
              active ? "border-primary/25" : "border-primary/10 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10"
            }`}
            key={`${item.question}-${index}`}
          >
            <button
              className="grid w-full gap-4 p-5 text-left sm:grid-cols-[56px_1fr_auto] sm:items-center sm:p-6"
              type="button"
              onClick={() => setOpen(active ? -1 : index)}
              aria-expanded={active}
            >
              <span className={`grid size-14 place-items-center rounded-2xl transition ${active ? "bg-primary text-white" : "bg-secondary text-primary"}`}>
                <FaIcon className="size-6" name={item.icon || "faq"} />
              </span>
              <span className="text-xl font-black leading-tight text-primary sm:text-2xl">{item.question}</span>
              <span className={`grid size-10 place-items-center rounded-full border border-primary/10 text-primary transition ${active ? "rotate-45 bg-secondary" : "bg-white"}`}>
                +
              </span>
            </button>

            <div className={`grid transition-all duration-300 ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="border-t border-primary/10 px-5 pb-6 pt-5 sm:ml-[80px] sm:px-6">
                  <p className="text-lg leading-8 text-muted">{item.answer}</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

import FaIcon from "@/components/FaIcon";

const phone = "923035988574";

export default function StickyWhatsappButton() {
  return (
    <a
      className="fixed bottom-5 right-5 z-[70] inline-flex min-h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 font-black text-white shadow-md shadow-primary/15 transition hover:bg-[#1ebe5d] sm:px-5 sm:shadow-2xl sm:shadow-primary/20 sm:hover:-translate-y-1"
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <span className="grid size-9 place-items-center rounded-full bg-white/18">
        <FaIcon className="size-5" name="phone" />
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

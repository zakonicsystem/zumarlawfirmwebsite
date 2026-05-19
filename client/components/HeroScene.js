const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85",
    alt: "Law books and gavel from Unsplash"
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
    alt: "Professional office from Unsplash"
  },
  {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85",
    alt: "Business documents from Unsplash"
  }
];

export default function HeroScene() {
  return (
    <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] border border-primary/10 bg-white p-3 shadow-2xl shadow-primary/15">
      <img className="h-[460px] w-full rounded-[1.5rem] object-cover" src={heroImages[0].src} alt={heroImages[0].alt} />
      <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-primary/75 via-primary/15 to-transparent" />
      <div className="absolute bottom-8 left-8 max-w-sm text-white">
        <p className="text-sm font-black uppercase text-secondary">Professional legal support</p>
        <h2 className="mt-2 text-3xl font-black leading-tight">Tax, corporate and regulatory services under one roof.</h2>
      </div>
      <div className="absolute right-6 top-6 hidden w-44 overflow-hidden rounded-3xl border-4 border-white shadow-xl sm:block">
        <img className="h-32 w-full object-cover" src={heroImages[1].src} alt={heroImages[1].alt} />
      </div>
      <div className="absolute bottom-6 right-6 hidden w-52 overflow-hidden rounded-3xl border-4 border-white shadow-xl md:block">
        <img className="h-36 w-full object-cover" src={heroImages[2].src} alt={heroImages[2].alt} />
      </div>
    </div>
  );
}

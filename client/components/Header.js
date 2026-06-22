"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FaIcon from "@/components/FaIcon";

const navGroups = [
  {
    label: "Home",
    href: "/",
    icon: "scale"
  },
  {
    label: "Services",
    href: "/services",
    icon: "filing"
  },
  {
    label: "Service Areas",
    href: "/service-areas",
    icon: "globe"
  },
  {
    label: "Tax Calculator",
    href: "/calculators",
    icon: "tax"
  },
  {
    label: "About",
    href: "/about",
    icon: "building",
    items: [
      {
        label: "About Zumar Law Firm",
        href: "/about",
        icon: "building",
        copy: "Company overview, values, mission, and registrations."
      },
      {
        label: "CEO",
        href: "/ceo",
        icon: "user",
        copy: "Leadership profile, firm history, and professional journey."
      },

    ]
  },
  {
    label: "Blog",
    href: "/blog",
    icon: "receipt"
  },
  {
    label: "Contact",
    href: "/contact",
    icon: "headset"
  }
];

export default function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileGroup, setActiveMobileGroup] = useState("Services");
  const visibleResults = useMemo(() => results.slice(0, 6), [results]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearchStatus(query.trim() ? "Searching..." : "");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
          cache: "no-store"
        });
        const payload = await response.json();
        setResults(payload.results || []);
        setSearchStatus("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setSearchStatus("Search is unavailable.");
        }
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setSearchStatus("");
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function submitSearch(event) {
    event.preventDefault();
    const target = visibleResults[0];
    if (target?.href) {
      closeSearch();
      router.push(target.href);
    }
  }

  return (
    <header className="relative z-[100] bg-white shadow-sm shadow-primary/10">
      <div className="bg-primary text-white">
        <div className="mx-auto flex min-h-12 w-[min(1180px,calc(100%-24px))] items-center justify-between gap-3 py-2 text-xs font-extrabold sm:w-[min(1180px,calc(100%-32px))] sm:py-0 sm:text-sm">
          <p className="hidden min-w-0 items-center gap-2 leading-5 sm:inline-flex">
            <FaIcon className="size-3.5 text-secondary" name="scale" />
            Trusted legal, tax, corporate, and regulatory advisory.
          </p>

          <p className="inline-flex min-w-0 items-center gap-2 leading-5 sm:hidden">
            <FaIcon className="size-3.5 shrink-0 text-secondary" name="scale" />
            <span className="truncate">Legal, tax & corporate advisory</span>
          </p>

          <div className="flex shrink-0 items-center gap-2 sm:gap-x-7">
            <button
              className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white/10 px-3 text-left font-extrabold transition hover:bg-white hover:text-primary sm:min-h-10 sm:px-4"
              type="button"
              onClick={() => setSearchOpen(true)}
            >
              <span className="hidden min-[360px]:inline">Search Services</span>
              <span className="sm:hidden">Search</span>
              <FaIcon className="size-4" name="search" />
            </button>
            <button className="hidden items-center gap-2 font-extrabold transition hover:text-secondary min-[420px]:inline-flex" type="button" aria-label="Change language">
              <span className="grid size-6 place-items-center rounded-full bg-white text-[10px] text-primary">EN</span>
              <span>English</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-paper to-secondary/35">
        <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] gap-3 py-4 text-center sm:w-[min(1180px,calc(100%-32px))] md:grid-cols-[1fr_auto_1fr] md:items-center md:py-7 md:text-left">
          <div className="order-2 grid gap-1 justify-items-center md:order-1 md:justify-items-start">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold text-ink/75 sm:text-base">
              <FaIcon className="size-4 text-primary" name="scale" />
              Legal, Tax & Corporate Services
            </p>
            <a className="text-lg font-black leading-none text-primary transition hover:text-primary/80 sm:text-2xl" href="tel:+923035988574">
              +92 303 598 8574
            </a>
          </div>

          <Link className="order-1 justify-self-center rounded-full bg-white p-2 shadow-xl shadow-primary/10 ring-1 ring-primary/10 sm:p-3 md:order-2" href="/" aria-label="Zumar Law Firm home" prefetch={false}>
            <img className="h-14 w-auto object-contain sm:h-24" src="/images/zumar-law-firm-logo.webp" alt="Zumar Law Firm logo" width="258" height="160" decoding="async" />
          </Link>

          <div className="order-3 grid gap-1 justify-items-center md:justify-items-end md:text-right">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold text-ink/75 sm:text-base">
              <FaIcon className="size-4 text-primary" name="globe" />
              National & International Advisory
            </p>
            <a className="break-all text-lg font-black leading-tight text-primary transition hover:text-primary/80 sm:text-2xl sm:leading-none" href="mailto:team@zumarlawfirm.com">
              team@zumarlawfirm.com
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white pb-3 sm:pb-5">
        <div className="mx-auto w-[min(1180px,calc(100%-24px))] rounded-lg bg-primary text-white shadow-xl shadow-primary/15 sm:w-[min(1180px,calc(100%-32px))]">
          <div className="flex items-center justify-between gap-2 px-2.5 py-2.5 sm:gap-3 sm:px-4 sm:py-4 lg:px-6">
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-3 text-xs font-black uppercase tracking-wide sm:min-h-12 sm:gap-3 sm:px-4 sm:text-sm lg:hidden"
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="grid gap-1">
                <span className="block h-0.5 w-5 rounded-full bg-white" />
                <span className="block h-0.5 w-5 rounded-full bg-white" />
                <span className="block h-0.5 w-5 rounded-full bg-white" />
              </span>
              Menu
            </button>

            <nav className="hidden items-center gap-1 text-base font-black lg:flex" aria-label="Primary navigation">
              {navGroups.map((group) => (
                <div className="group relative" key={group.label}>
                  <Link className="inline-flex min-h-12 items-center gap-2 rounded-md px-4 transition hover:bg-white/10 hover:text-secondary" href={group.href} prefetch={false}>
                    <FaIcon className="size-4 text-secondary" name={group.icon} />
                    {group.label}
                    {group.items ? <span className="text-xs text-white/60">+</span> : null}
                  </Link>
                  {group.items ? (
                    <div className="invisible absolute left-0 top-full z-40 w-[360px] translate-y-3 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="rounded-2xl border border-primary/10 bg-white p-3 text-ink shadow-2xl shadow-primary/20">
                        <div className="mb-2 rounded-xl bg-paper px-4 py-3">
                          <p className="text-xs font-black uppercase tracking-wide text-primary/60">{group.label}</p>
                          <p className="mt-1 text-sm font-semibold text-muted">Choose a section to continue.</p>
                        </div>
                        <div className="grid gap-1">
                          {group.items.map((item) => (
                            <Link className="grid grid-cols-[40px_1fr] gap-3 rounded-xl p-3 transition hover:bg-secondary/60" href={item.href} key={item.href} prefetch={false}>
                              <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
                                <FaIcon className="size-4" name={item.icon} />
                              </span>
                              <span>
                                <span className="block font-black text-primary">{item.label}</span>
                                <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-5 text-muted">{item.copy}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <Link className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-white px-3 text-[11px] font-black uppercase tracking-wide text-ink transition hover:bg-secondary hover:text-primary sm:min-h-12 sm:px-8 sm:text-sm" href="/appointment" prefetch={false}>
              Appointment
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[110] overflow-y-auto bg-paper lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="flex min-h-dvh w-full flex-col bg-paper">
            <div className="border-b border-primary/10 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Menu</p>
                  <h2 className="mt-1 text-2xl font-black leading-tight text-primary sm:text-3xl">Zumar Law Firm</h2>
                </div>
                <button className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/10 bg-white text-xl font-black text-primary" type="button" onClick={closeMobileMenu} aria-label="Close menu">
                  x
                </button>
              </div>
              <button
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black uppercase text-white"
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setSearchOpen(true);
                }}
              >
                <FaIcon className="size-4" name="search" />
                Search Services
              </button>
            </div>

            <div className="flex-1 bg-paper p-3 sm:p-4">
              <div className="grid gap-3">
                {navGroups.map((group) => {
                  const isActive = activeMobileGroup === group.label;

                  return (
                    <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white" key={group.label}>
                      <button
                        className={`flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left text-primary ${isActive ? "bg-secondary/55" : "bg-white"}`}
                        type="button"
                        onClick={() => setActiveMobileGroup(isActive ? "" : group.label)}
                        aria-expanded={isActive}
                      >
                        <span className="inline-flex min-w-0 items-center gap-3">
                          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${isActive ? "bg-primary text-white" : "bg-secondary text-primary"}`}>
                            <FaIcon className="size-4" name={group.icon} />
                          </span>
                          <span className="text-base font-black">{group.label}</span>
                        </span>
                        <span className="text-lg font-black text-primary/50">{isActive ? "-" : "+"}</span>
                      </button>

                      {isActive ? (
                        <div className="grid gap-2 p-3">
                          <Link className="rounded-2xl bg-paper p-4 text-primary" href={group.href} onClick={closeMobileMenu} prefetch={false}>
                            <span className="block text-base font-black">Open {group.label}</span>
                            <span className="mt-1 block text-sm font-semibold leading-5 text-muted">Main page</span>
                          </Link>
                          {(group.items || []).map((item) => (
                            <Link className="grid grid-cols-[42px_1fr] gap-3 rounded-2xl border border-primary/10 bg-white p-4" href={item.href} key={item.href} onClick={closeMobileMenu} prefetch={false}>
                              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                                <FaIcon className="size-4" name={item.icon} />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-base font-black text-primary">{item.label}</span>
                                <span className="mt-1 block text-sm leading-5 text-muted">{item.copy}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-primary/10 bg-white p-3 sm:p-4">
              <Link className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-black uppercase tracking-wide text-white" href="/appointment" onClick={closeMobileMenu} prefetch={false}>
                Appointment
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-[120] flex min-h-dvh items-start justify-center overflow-y-auto bg-ink/55 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8" role="dialog" aria-modal="true" aria-label="Search services">
          <div className="flex max-h-[calc(100dvh-32px)] w-full max-w-2xl flex-col rounded-2xl bg-white p-4 shadow-2xl shadow-primary/25 sm:max-h-[calc(100dvh-64px)] sm:p-7">
            <div className="mb-5 flex shrink-0 items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Search</p>
                <h2 className="mt-1 text-2xl font-black text-primary sm:text-3xl">Find legal support</h2>
              </div>
              <button
                className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/10 text-primary transition hover:bg-secondary"
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
              >
                x
              </button>
            </div>

            <form className="relative shrink-0" onSubmit={submitSearch}>
              <FaIcon className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-primary/45" name="search" />
              <input
                className="min-h-14 w-full rounded-full border border-primary/15 bg-paper pl-12 pr-5 text-base font-semibold text-ink outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:pr-32"
                type="search"
                placeholder="Search tax, registration, licensing, compliance..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
              <button className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-black uppercase tracking-wide text-white transition hover:bg-primary/90 sm:absolute sm:right-1.5 sm:top-1.5 sm:mt-0 sm:min-h-11 sm:w-auto" type="submit">
                Search
              </button>
            </form>
            <div className="mt-5 grid flex-1 gap-2 overflow-y-auto overscroll-contain pr-1 sm:pr-2">
              {searchStatus ? <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-black text-primary">{searchStatus}</p> : null}
              {visibleResults.map((item) => (
                <Link
                  className="group grid gap-1 rounded-2xl border border-primary/10 bg-white px-4 py-3 shadow-sm shadow-primary/5 transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-paper"
                  href={item.href}
                  key={`${item.type}-${item.href}`}
                  onClick={closeSearch}
                  prefetch={false}
                >
                  <span className="text-xs font-black uppercase tracking-wide text-primary/55">{item.type}</span>
                  <span className="font-black text-primary group-hover:text-primary/85">{item.title}</span>
                  {item.summary ? <span className="line-clamp-2 text-sm leading-6 text-muted">{item.summary}</span> : null}
                </Link>
              ))}
              {query.trim() && !searchStatus && visibleResults.length === 0 ? (
                <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-black text-primary">No matching result found.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

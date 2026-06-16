const icons = {
  appointment: (
    <>
      <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="m8 15 2.2 2.2L16 12" />
    </>
  ),
  alignCenter: <path d="M6 5h12M4 9h16M7 13h10M4 17h16" />,
  alignJustify: <path d="M4 5h16M4 9h16M4 13h16M4 17h16" />,
  alignLeft: <path d="M4 5h16M4 9h11M4 13h16M4 17h11" />,
  alignRight: <path d="M4 5h16M9 9h11M4 13h16M9 17h11" />,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  bold: <path d="M8 5h5.5a3 3 0 0 1 0 6H8V5Zm0 6h6a3.5 3.5 0 0 1 0 7H8v-7Z" />,
  building: (
    <>
      <path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17" />
      <path d="M9 21v-5h6v5M9 7h.01M15 7h.01M9 11h.01M15 11h.01" />
    </>
  ),
  business: (
    <>
      <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z" />
      <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M4 13h16" />
    </>
  ),
  certificate: (
    <>
      <circle cx="12" cy="10" r="4" />
      <path d="m9.5 13.5-1 6 3.5-2 3.5 2-1-6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  copyright: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.7a4 4 0 1 0 0 4.6" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  eraser: <path d="m4 16 8-8 7 7-5 5H8l-4-4Zm8 4h8" />,
  faq: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.7 2.7 0 1 1 4.3 2.2c-.9.6-1.8 1.2-1.8 2.3M12 17h.01" />
    </>
  ),
  filing: (
    <>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  fingerprint: <path d="M7 13a5 5 0 0 1 10 0c0 3-1 5-3 7M10 21c1.2-1.5 2-3.9 2-7M5 17c.8-1.5 1-2.6 1-4a6 6 0 0 1 12 0c0 1.6-.2 3.1-.8 4.5M8 4.6A8 8 0 0 1 20 12" />,
  gavel: <path d="m14 6 4 4M8 12l4 4M9 3l12 12-3 3L6 6l3-3Zm-5 18h10" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  handshake: <path d="M7 12 4 9l3-3 3 3m7 3 3-3-3-3-4 4M8 13l3 3a2 2 0 0 0 3 0l4-4M3 15l4 4M21 15l-4 4" />,
  heading: <path d="M6 5v14M18 5v14M6 12h12M10 19h8" />,
  headset: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0v3a2 2 0 0 1-2 2h-2v-6h4M4 16a2 2 0 0 0 2 2h2v-6H4v4Z" />
      <path d="M14 21h1a3 3 0 0 0 3-3" />
    </>
  ),
  id: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c.7-1.3 1.7-2 3-2s2.3.7 3 2M14 10h4M14 14h4" />
    </>
  ),
  italic: <path d="M10 5h8M6 19h8M14 5l-4 14" />,
  landmark: (
    <>
      <path d="M3 10h18L12 4 3 10ZM5 10v8M9 10v8M15 10v8M19 10v8M4 20h16" />
    </>
  ),
  link: <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />,
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  listNumber: <path d="M10 6h10M10 12h10M10 18h10M4 5h2v4M4 11h3l-3 4h3M4 18h3" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  phone: <path d="M6.6 3.8 9 8.5l-2 1.6a12 12 0 0 0 6.9 6.9l1.6-2 4.7 2.4c.6.3.9 1 .6 1.6-.7 1.6-2.3 2.6-4 2.3C9.7 20.1 3.9 14.3 2.7 7.2c-.3-1.7.7-3.3 2.3-4 .6-.3 1.3 0 1.6.6Z" />,
  quote: <path d="M8 8H5a4 4 0 0 0-4 4v5h7v-7H5.2A2.2 2.2 0 0 1 7.4 8H8Zm15 0h-3a4 4 0 0 0-4 4v5h7v-7h-2.8A2.2 2.2 0 0 1 22.4 8H23Z" />,
  ranking: (
    <>
      <path d="M5 19V9M12 19V5M19 19v-7" />
      <path d="m12 3 1.2 2.4 2.6.4-1.9 1.9.5 2.6L12 9l-2.4 1.3.5-2.6-1.9-1.9 2.6-.4L12 3Z" />
    </>
  ),
  receipt: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6M9 16h4" />,
  registration: (
    <>
      <circle cx="10" cy="8" r="3" />
      <path d="M4 19c.8-3.2 3-5 6-5s5.2 1.8 6 5M18 7v6M15 10h6" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M5 6h14M7 6l-4 7h8L7 6ZM17 6l-4 7h8l-4-7ZM7 21h10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </>
  ),
  shield: <path d="M12 3 20 6v6c0 5-3.3 8-8 9-4.7-1-8-4-8-9V6l8-3Z" />,
  stamp: <path d="M9 4h6v7l3 2v3H6v-3l3-2V4ZM5 20h14" />,
  star: <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9L12 3Z" />,
  table: <path d="M4 5h16v14H4V5Zm0 5h16M4 14h16M9 5v14M15 5v14" />,
  tax: (
    <>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v5h5M9 12h6M10 17l4-4" />
    </>
  ),
  trash: <path d="M4 7h16M9 7V5h6v2M7 7l1 14h8l1-14M10 11v6M14 11v6" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8" />,
  underline: <path d="M7 4v6a5 5 0 0 0 10 0V4M6 21h12" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.3-4 4-6 8-6s6.7 2 8 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20c1-3.3 3-5 6-5s5 1.7 6 5M14 15c2.5.2 4.2 1.8 5 5" />
    </>
  )
};

const aliases = {
  arms: "shield",
  balance: "scale",
  chamber: "handshake",
  labour: "users",
  trademark: "receipt"
};

export default function FaIcon({ name, className = "" }) {
  const key = aliases[name] || name;

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {icons[key] || icons.scale}
    </svg>
  );
}

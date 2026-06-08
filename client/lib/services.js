import { serviceData } from "./serviceSchemas.js";

export const categories = [
  "Sales Tax",
  "NTN",
  "PSEB Reg",
  "Company Reg",
  "Income Tax",
  "Arms License",
  "NPO / NGO",
  "Intellectual Property",
  "Import Export",
  "Regulatory & Licensing",
  "Chamber of Commerce",
  "Professional Registration",
  "Labour Registration",
  "USA LLC Formation",
  "USA Banking",
  "UK Company Registration",
  "International Trademark"
];

const icons = {
  arms: "arms",
  chamber: "chamber",
  company: "building",
  copyright: "copyright",
  gst: "receipt",
  importExport: "globe",
  labour: "labour",
  ntnBusiness: "business",
  ntnCompany: "building",
  ntnNgo: "landmark",
  ntnPartner: "handshake",
  ntnSalaried: "id",
  patent: "certificate",
  professional: "stamp",
  regulatory: "shield",
  tax: "tax",
  trademark: "trademark"
};

const serviceIndex = [
  ["NTN Registration - Salaried", "NTN", icons.ntnSalaried],
  ["NTN Registration - Partnership", "NTN", icons.ntnPartner],
  ["NTN Registration - Business", "NTN", icons.ntnBusiness],
  ["NTN Registration - Company", "NTN", icons.ntnCompany],
  ["NTN Registration - NGO/NPO", "NTN", icons.ntnNgo],
  ["GST Registration - Trader", "Sales Tax", icons.gst],
  ["GST Registration - Manufacturer", "Sales Tax", icons.gst],
  ["Monthly Federal / Provincial Sales Tax Return Filing", "Sales Tax", icons.tax],
  ["PST Registration - Individual", "Sales Tax", icons.tax],
  ["PST Registration - Partnership", "Sales Tax", icons.tax],
  ["PST Registration - Company", "Sales Tax", icons.tax],
  ["Annual Tax Return - Salaried", "Income Tax", icons.tax],
  ["Annual Tax Return - Sole Proprietor", "Income Tax", icons.tax],
  ["Annual Tax Return - Company", "Income Tax", icons.tax],
  ["Annual Tax Return - NPO/NGO", "Income Tax", icons.tax],
  ["Private Limited Company Registration", "Company Reg", icons.company],
  ["Single Member Company Registration", "Company Reg", icons.company],
  ["Limited Liability Partnership (LLP)", "Company Reg", icons.company],
  ["Partnership/AOP Registration", "Company Reg", icons.company],
  ["Company Transfer", "Company Reg", icons.company],
  ["Company Close", "Company Reg", icons.company],
  ["SECP Company Filing", "Company Reg", icons.company],
  ["Newspaper Registration", "Company Reg", icons.company],
  ["PSDA License", "Company Reg", icons.company],
  ["Food Authority License", "Company Reg", icons.company],
  ["ZGO License", "Company Reg", icons.company],
  ["DTS License", "Company Reg", icons.company],
  ["Medical Store License", "Company Reg", icons.company],
  ["Arms License - Punjab (Non-Prohibited Bore)", "Arms License", icons.arms],
  ["Arms License - All Pakistan (Non-Prohibited Bore)", "Arms License", icons.arms],
  ["ICT Arms License (Punjab/Islamabad)", "Arms License", icons.arms],
  ["NPO Registration with SECP", "NPO / NGO", icons.ntnNgo],
  ["NGO Registration with Registrar", "NPO / NGO", icons.ntnNgo],
  ["NGO/NPO Registration", "NPO / NGO", icons.ntnNgo],
  ["Registration of NGOs/ Charities/ Trusts with Sindh Charity Commission", "NPO / NGO", icons.ntnNgo],
  ["Company Renewal Registration", "PSEB Reg", icons.company],
  ["Company Registration PSEB", "PSEB Reg", icons.company],
  ["New Call Center Registration", "PSEB Reg", icons.company],
  ["Call Center Renewal Registration", "PSEB Reg", icons.company],
  ["Freelancer Registration", "PSEB Reg", icons.company],
  ["Freelancer Renewal", "PSEB Reg", icons.company],
  ["Trademark Registration", "Intellectual Property", icons.trademark],
  ["Copyright Registration", "Intellectual Property", icons.copyright],
  ["Patent Registration", "Intellectual Property", icons.patent],
  ["Sole Proprietor", "Import Export", icons.importExport],
  ["Partnership firm", "Import Export", icons.importExport],
  ["Private Limited Company (PVT)", "Import Export", icons.importExport],
  ["Import Export License", "Import Export", icons.importExport],
  ["RTO Password Recovery", "Income Tax", icons.tax],
  ["DNFBP License - Sole Proprietorship", "Regulatory & Licensing", icons.regulatory],
  ["DNFBP License - Company", "Regulatory & Licensing", icons.regulatory],
  ["DNFBP License - AOP/Partnership", "Regulatory & Licensing", icons.regulatory],
  ["OEP License", "Regulatory & Licensing", icons.regulatory],
  ["Chamber of Commerce New Membership - Sole Proprietor", "Chamber of Commerce", icons.chamber],
  ["Chamber of Commerce New Membership - Company", "Chamber of Commerce", icons.chamber],
  ["Chamber of Commerce New Membership - AOP/Partnership", "Chamber of Commerce", icons.chamber],
  ["Chamber of Commerce Renewal", "Chamber of Commerce", icons.chamber],
  ["PEC Firm Registration - Sole Proprietor", "Professional Registration", icons.professional],
  ["PEC Firm Registration - Company", "Professional Registration", icons.professional],
  ["PEC Firm Registration - AOP/Partnership", "Professional Registration", icons.professional],
  ["PEC Engineer Registration", "Professional Registration", icons.professional],
  ["Labour Department Registration", "Labour Registration", icons.labour]
];

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(value) {
  if (Array.isArray(value)) {
    return `PKR ${value[0].toLocaleString()} - ${value[1].toLocaleString()}`;
  }

  if (!value) {
    return "Consultation based";
  }

  if (typeof value === "string") {
    return value;
  }

  return `PKR ${value.toLocaleString()}`;
}

export function getServiceTimeline(title, category) {
  const text = `${title || ""} ${category || ""}`.toLowerCase();

  if (text.includes("trademark") && text.includes("usa")) {
    return "6 to 8 months";
  }

  if (text.includes("trademark") || text.includes("copyright") || text.includes("patent")) {
    return "2 to 8 months";
  }

  if (text.includes("oep")) {
    return "30 to 45 working days";
  }

  if (text.includes("arms license") || text.includes("npo") || text.includes("ngo")) {
    return "30 to 90 working days";
  }

  if (text.includes("company registration") || text.includes("llp") || text.includes("partnership")) {
    return "3 to 10 working days";
  }

  if (text.includes("return") || text.includes("password recovery")) {
    return "1 to 3 working days";
  }

  if (text.includes("license") || text.includes("registration") || text.includes("membership")) {
    return "7 to 30 working days";
  }

  return "3 to 7 working days";
}

function makeSummary(title, category) {
  const shortTitle = title.replace(/\s*\([^)]*\)/g, "");
  return `Professional ${shortTitle.toLowerCase()} support with document review, filing guidance, and follow-up handled by the Zumar Law Firm team.`;
}

export const services = serviceIndex.map(([title, category, icon]) => {
  const fields = serviceData.fields?.[title] || [];
  const price = serviceData.prices?.[title];

  return {
    title,
    category,
    icon,
    slug: slugify(title),
    price,
    formattedPrice: formatPrice(price),
    timeline: getServiceTimeline(title, category),
    summary: makeSummary(title, category),
    fields,
    requirements: fields.map((field) => field.label).filter(Boolean)
  };
});

export const internationalServices = [
  {
    title: "Florida LLC Package",
    category: "USA LLC Formation",
    icon: icons.company,
    slug: "florida-llc-package",
    price: "$415",
    formattedPrice: "$415",
    timeline: "7 to 14 working days",
    summary: "Florida LLC formation package with address, mail forwarding, registered agent, EIN, reseller certificate, business accounts, US phone number, tax updates, and lifetime support.",
    requirements: [
      "Unique physical address for 1 year included $85",
      "Mail forwarding service included",
      "Registered agent fee included",
      "LLC formation with state fee included $125",
      "Articles of Organization",
      "Employer Identification Number EIN",
      "Reseller Certificate or Seller Permit",
      "Payoneer Business Account",
      "Zyla Business Account $35",
      "US phone number for 1 year included $20",
      "Business tax updates",
      "Lifetime customer support",
      "Service charges included $150",
      "State note: Income tax free state",
      "Renewal fee: $140"
    ],
    serviceType: "international"
  },
  {
    title: "Texas LLC Package",
    category: "USA LLC Formation",
    icon: icons.company,
    slug: "texas-llc-package",
    price: "$600",
    formattedPrice: "$600",
    timeline: "7 to 14 working days",
    summary: "Texas LLC formation package with physical address, mail forwarding, registered agent, state filing, EIN, business accounts, phone number, tax updates, and lifetime support.",
    requirements: [
      "Unique physical address for 1 year included $85",
      "Mail forwarding service included",
      "Registered agent fee included",
      "LLC formation with state fee included $310",
      "Articles of Organization",
      "Employer Identification Number EIN",
      "Payoneer Business Account",
      "Zyla Business Account $35",
      "US phone number for 1 year included $20",
      "Business tax updates",
      "Lifetime customer support",
      "Service charges included $150",
      "State note: Income tax and renewal free state"
    ],
    serviceType: "international"
  },
  {
    title: "Wyoming LLC Package",
    category: "USA LLC Formation",
    icon: icons.company,
    slug: "wyoming-llc-package",
    price: "$390",
    formattedPrice: "$390",
    timeline: "7 to 14 working days",
    summary: "Wyoming LLC formation package with business address, mail forwarding, registered agent, state filing, EIN, reseller certificate, Zyla account, phone number, and lifetime support.",
    requirements: [
      "Unique physical address for 1 year included $80",
      "Mail forwarding service included",
      "Registered agent fee included",
      "LLC formation with state fee included $105",
      "Articles of Organization",
      "Employer Identification Number EIN",
      "Reseller Certificate or Seller Permit",
      "Zyla Business Account fee included $35",
      "US phone number for 1 year included $20",
      "Business tax updates",
      "Unlimited name searches",
      "Lifetime customer support",
      "Service charges included $150",
      "State note: Income tax free state",
      "Renewal fee: $50"
    ],
    serviceType: "international"
  },
  {
    title: "Colorado LLC Package",
    category: "USA LLC Formation",
    icon: icons.company,
    slug: "colorado-llc-package",
    price: "$290",
    formattedPrice: "$290",
    timeline: "7 to 14 working days",
    summary: "Colorado LLC formation package with shared business address, mail forwarding, registered agent, state filing, EIN, business accounts, phone number, and tax updates.",
    requirements: [
      "Shared business address for 1 year included $35",
      "Mail forwarding service included",
      "Registered agent fee included",
      "LLC formation with state fee included $50",
      "Articles of Organization",
      "Employer Identification Number EIN",
      "Payoneer Business Account",
      "Wise Business Account $35 with UK details",
      "US phone number for 1 year included $20",
      "Business tax updates",
      "Lifetime customer support",
      "Service charges included $150",
      "State note: 4% income tax",
      "Renewal fee: $25"
    ],
    serviceType: "international"
  },
  {
    title: "Missouri LLC Package",
    category: "USA LLC Formation",
    icon: icons.company,
    slug: "missouri-llc-package",
    price: "$310",
    formattedPrice: "$310",
    timeline: "7 to 14 working days",
    summary: "Missouri LLC package with shared business address, mail forwarding, registered agent, filing, EIN, business accounts, phone number, tax updates, and lifetime support.",
    requirements: [
      "Shared business address for 1 year included $45",
      "Mail forwarding service included",
      "Registered agent fee included",
      "LLC formation with state fee included $50",
      "Articles of Organization",
      "Employer Identification Number EIN",
      "Payoneer Business Account included",
      "Wise Business Account $35 with UK details",
      "US phone number for 1 year included $20",
      "Business tax updates",
      "Unlimited name searches",
      "Lifetime customer support",
      "Service charges included $150",
      "State note: 6% income tax",
      "Renewal fee: $0"
    ],
    serviceType: "international"
  },
  {
    title: "USA Physical Bank Account Service",
    category: "USA Banking",
    icon: icons.importExport,
    slug: "usa-physical-bank-account-service",
    price: "$2,250",
    formattedPrice: "$2,250",
    timeline: "30 working days",
    summary: "USA physical bank account support for eligible clients with Bank of America, Chase Bank, Wells Fargo, Truist, and IPC options.",
    requirements: [
      "Available banks: Bank of America, Chase Bank, Wells Fargo, Truist, IPC",
      "Passport or CNIC",
      "Company name",
      "New Gmail account with password",
      "Processing time: 30 working days",
      "Call centre clients are not eligible for a physical bank account",
      "E cheque services are not available",
      "This physical bank account will not be created on an existing or new LLC"
    ],
    serviceType: "international"
  },
  {
    title: "UK Limited Company Registration",
    category: "UK Company Registration",
    icon: icons.company,
    slug: "uk-limited-company-registration",
    price: "£250",
    formattedPrice: "£250",
    timeline: "3 to 7 working days",
    summary: "UK Limited Company registration with registered office address, HMRC fee, incorporation documents, UTR, authentication code, gateway ID, and Companies House logins.",
    requirements: [
      "UK Limited Company Registration",
      "Physical registered office address",
      "Address use for marketing and advertising",
      "HMRC UK Government fee",
      "All UK company documents",
      "Certificate of Incorporation",
      "Memorandum of Association",
      "Articles of Association",
      "Shareholding Certificate",
      "Unique Taxpayer Reference Number UTR",
      "Company Authentication Code",
      "Company Gateway ID",
      "UK Companies House login",
      "UK Companies House Web Filing login",
      "One time fee: £250",
      "Annual charges: No annual charges"
    ],
    serviceType: "international"
  },
  {
    title: "Australia Trademark Registration",
    category: "International Trademark",
    icon: icons.trademark,
    slug: "australia-trademark-registration",
    price: "AUD 250 + $150 service fee",
    formattedPrice: "AUD 250 + $150 service fee",
    timeline: "6 to 8 months",
    summary: "Australia trademark filing support for word marks or logos with applicant details, goods and services classification, and filing preparation.",
    requirements: [
      "Trademark name or logo",
      "High resolution JPEG file if logo is provided",
      "Full legal company name",
      "Applicant address",
      "Email address",
      "Contact number",
      "Clear description of goods or services",
      "Australian trademark classes, similar to Nice Classification",
      "Filing for 1 class: AUD 250",
      "Additional class: AUD 150 per class",
      "Our service charges: $150",
      "Filing can begin once all required details are provided"
    ],
    serviceType: "international"
  },
  {
    title: "Canada Trademark Registration",
    category: "International Trademark",
    icon: icons.trademark,
    slug: "canada-trademark-registration",
    price: "CAD 491 + $150 service fee",
    formattedPrice: "CAD 491 + $150 service fee",
    timeline: "6 to 12 months",
    summary: "Canada trademark filing support for Canadian or foreign applicants with agent details, Nice Classification information, and filing preparation.",
    requirements: [
      "Trademark name or logo",
      "High resolution JPEG file if logo is provided",
      "Full legal company name",
      "Canadian company or foreign company with Canadian agent",
      "Address including postal code",
      "Email address",
      "Contact number",
      "Clear description of goods or services",
      "Nice Classification details",
      "Filing for 1 class: CAD 491",
      "Additional class: CAD 149 per class",
      "Our service charges: $150",
      "Filing can begin once all required details are provided"
    ],
    serviceType: "international"
  },
  {
    title: "UK Trademark Registration",
    category: "International Trademark",
    icon: icons.trademark,
    slug: "uk-trademark-registration",
    price: "£170 + $150 service fee",
    formattedPrice: "£170 + $150 service fee",
    timeline: "4 to 6 months",
    summary: "UK trademark filing support for word marks, logos, device marks, and combined marks with applicant and goods/services classification details.",
    requirements: [
      "Word mark or logo that you want to register",
      "Trademark type: Word mark, logo or device mark, or combined mark",
      "Full legal name of individual or company",
      "Company name and registered address if applying as a business",
      "Complete address including postcode",
      "Nationality or country of incorporation",
      "Products or services you want to protect",
      "Goods and services will be classified under the correct Nice Classes",
      "Email address",
      "Phone number",
      "UKIPO official fee first class: £170",
      "Each additional class: £50",
      "Our service charges: $150",
      "Filing can begin once all required details are provided"
    ],
    serviceType: "international"
  },
  {
    title: "USA Trademark Registration",
    category: "International Trademark",
    icon: icons.trademark,
    slug: "usa-trademark-registration",
    price: "$500",
    formattedPrice: "$500",
    timeline: "6 to 8 months",
    summary: "USA trademark filing support with USPTO class fee guidance, applicant identity details, residential address, address proof, and filing timeline.",
    requirements: [
      "Trademark name or logo",
      "Trademark type: Word mark, logo mark, or combined mark",
      "Full legal name of individual or company",
      "Company name and registered address if applying as a company",
      "Complete address with ZIP code",
      "Nationality or country of incorporation",
      "Details of the products or services you sell",
      "Email address",
      "Phone number",
      "Passport or government ID",
      "Complete residential address",
      "Address proof such as gas, water, electricity, or internet bill",
      "Government fee: $350 per class",
      "Service fee: $150",
      "Total for 1 class: $500",
      "Application filed within 2 days after receiving all required details",
      "Final registration certificate usually takes around 6 to 8 months"
    ],
    serviceType: "international"
  }
];

export function getServiceBySlug(slug) {
  const normalizedSlug = normalizeSlug(slug);
  return services.find((service) => normalizeSlug(service.slug) === normalizedSlug);
}

export function getFeaturedServices() {
  return [
    "NTN Registration - Business",
    "Private Limited Company Registration",
    "Import Export License",
    "Trademark Registration",
    "GST Registration - Trader",
    "Company Registration PSEB"
  ]
    .map((title) => services.find((service) => service.title === title))
    .filter(Boolean);
}

export function groupedServices() {
  return categories
    .map((category) => ({
      category,
      services: services.filter((service) => service.category === category)
    }))
    .filter((group) => group.services.length > 0);
}

export const quickLinks = [
  { title: "About Zumar Law Firm", href: "/about" },
  { title: "CEO", href: "/ceo" },
  { title: "Service Areas", href: "/service-areas" },
  { title: "Blog", href: "/blog" },
  { title: "Tax Calculator", href: "/calculators" },
  { title: "Careers", href: "/careers" },
  { title: "Branches", href: "/branches" },
  { title: "Contact", href: "/contact" },
  { title: "Client Portal", href: "https://app.zumarlawfirm.com/login" },
  { title: "Create Account", href: "https://app.zumarlawfirm.com/signup" }
];

export const policyLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms & Conditions", href: "/terms-and-conditions" },
  { title: "Refund Policy", href: "/refund-policy" }
];

export const branches = [
  {
    name: "Lahore",
    slug: "lahore",
    phone: "042-3724555",
    email: "team@zumarlawfirm.com",
    address: "Al Meraj Arcade Chowk Chaburji Lahore",
    googleMapUrl: "https://www.google.com/maps/place/Zumar+Law+Firm/@31.5545954,74.3028964,676m/data=!3m3!1e3!4b1!5s0x3919035239402f37:0xab082b65398f26be!4m6!3m5!1s0x3919019c399b3c3f:0x8386d63b401f100a!8m2!3d31.5545909!4d74.3054713!16s%2Fg%2F11l1f488xq?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
    image: "/images/zumar-law-firm-lahore-office.webp"
  },
  {
    name: "Rawalpindi/Islamabad",
    slug: "rawalpindi-islamabad",
    phone: "051-8445595",
    email: "team@zumarlawfirm.com",
    address: "Office No 8B 5th Floor Rizwan Arcade Adam Jee Road Sadar",
    googleMapUrl: "https://www.google.com/maps/place/ZUMAR+LAW+FIRM+ISLAMABAD/@33.5951302,73.0370388,2643m/data=!3m2!1e3!4b1!4m6!3m5!1s0x38df95720e9437fb:0xab6d1a24fef97ef1!8m2!3d33.5951137!4d73.0554928!16s%2Fg%2F11zj82y2kg?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
    image: "/images/zumar-law-firm-islamabad-office.webp"
  }
];

export function getBranchBySlug(slug) {
  const normalizedSlug = normalizeSlug(slug);
  return branches.find((branch) => normalizeSlug(branch.slug) === normalizedSlug);
}

export const serviceAreas = [
  {
    title: "Lahore",
    slug: "lahore",
    province: "Punjab",
    icon: "landmark",
    image: "/images/zumar-law-firm-lahore-office.webp",
    summary: "Tax, company registration, sales tax, trademark, licensing, and compliance support for Lahore clients.",
    coverage: "Our Lahore team supports individuals, startups, retailers, exporters, service businesses, and companies across the city with online filing and branch-based consultation.",
    relatedCategories: ["NTN", "Sales Tax", "Income Tax", "Company Reg", "Intellectual Property"]
  },
  {
    title: "Rawalpindi / Islamabad",
    slug: "rawalpindi-islamabad",
    province: "Punjab / Islamabad",
    icon: "landmark",
    image: "/images/zumar-law-firm-islamabad-office.webp",
    summary: "Registration, tax filing, corporate compliance, and licensing support for Rawalpindi and Islamabad.",
    coverage: "We assist clients across Rawalpindi, Islamabad, Saddar, Blue Area, I-8, G-9, Bahria, DHA, and nearby business locations.",
    relatedCategories: ["NTN", "Sales Tax", "Income Tax", "Company Reg", "Regulatory & Licensing"]
  },
  {
    title: "Faisalabad",
    slug: "faisalabad",
    province: "Punjab",
    icon: "building",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=85",
    summary: "Business registration, income tax, sales tax, import export, and compliance help for Faisalabad businesses.",
    coverage: "Zumar Law Firm supports textile businesses, traders, manufacturers, service providers, and salaried taxpayers in Faisalabad through remote and appointment-based services.",
    relatedCategories: ["NTN", "Sales Tax", "Income Tax", "Import Export", "Company Reg"]
  },
  {
    title: "Okara",
    slug: "okara",
    province: "Punjab",
    icon: "shield",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=85",
    summary: "Online tax, registration, company, and compliance services for Okara and nearby business communities.",
    coverage: "Clients in Okara can start consultations online, share documents securely, and receive filing support for FBR, SECP, sales tax, and licensing matters.",
    relatedCategories: ["NTN", "Income Tax", "Sales Tax", "Company Reg", "Professional Registration"]
  },
  {
    title: "Karachi",
    slug: "karachi",
    province: "Sindh",
    icon: "globe",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1100&q=85",
    summary: "FBR, SRB, company registration, trademark, import export, and business compliance support for Karachi.",
    coverage: "We support Karachi clients remotely for registrations, filings, documentation, notices, and recurring compliance across federal and Sindh authorities.",
    relatedCategories: ["NTN", "Sales Tax", "Income Tax", "Company Reg", "Intellectual Property", "Import Export"]
  },
  {
    title: "Multan",
    slug: "multan",
    province: "Punjab",
    icon: "tax",
    image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1100&q=85",
    summary: "Taxpayer registration, return filing, business setup, and licensing support for Multan clients.",
    coverage: "Our online workflow helps Multan clients complete documentation, submit records, and track tax and corporate work without visiting a branch.",
    relatedCategories: ["NTN", "Income Tax", "Sales Tax", "Company Reg", "Chamber of Commerce"]
  },
  {
    title: "Peshawar",
    slug: "peshawar",
    province: "Khyber Pakhtunkhwa",
    icon: "filing",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=85",
    summary: "KPRA, FBR, company registration, licensing, and filing support for Peshawar clients.",
    coverage: "We help Peshawar individuals and businesses prepare documents, register with authorities, and manage tax and compliance steps online.",
    relatedCategories: ["NTN", "Income Tax", "Sales Tax", "Company Reg", "Regulatory & Licensing"]
  },
  {
    title: "Quetta",
    slug: "quetta",
    province: "Balochistan",
    icon: "scale",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=85",
    summary: "Federal tax, sales tax, business registration, and compliance assistance for Quetta clients.",
    coverage: "Quetta clients can work with our team remotely for registration, filing, licensing, and document review across common business services.",
    relatedCategories: ["NTN", "Income Tax", "Sales Tax", "Company Reg", "Regulatory & Licensing"]
  }
];

export function getServiceAreaBySlug(slug) {
  const normalizedSlug = normalizeSlug(slug);
  return serviceAreas.find((area) => normalizeSlug(area.slug) === normalizedSlug);
}



export const blogPosts = [
  {
    title: "Case Completed: NTN registration for a new sole proprietor",
    slug: "case-completed-ntn-registration-sole-proprietor",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1100&q=85",
    service: "NTN Registration",
    summary: "A completed client matter covering document review, business details, taxpayer profile setup, and final NTN registration."
  },
  {
    title: "Case Completed: Private limited company registration",
    slug: "case-completed-private-limited-company-registration",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=85",
    service: "Company Registration",
    summary: "A completed company formation case including name planning, director records, incorporation, and post-registration guidance."
  },
  {
    title: "Case Completed: Import export license for trading business",
    slug: "case-completed-import-export-license-trading-business",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1100&q=85",
    service: "Import Export License",
    summary: "A completed trade registration matter with business verification, supporting documents, and license follow-up."
  },
  {
    title: "Case Completed: Trademark filing for a local brand",
    slug: "case-completed-trademark-filing-local-brand",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1100&q=85",
    service: "Trademark Registration",
    summary: "A completed intellectual property matter covering brand details, logo record, owner documents, and filing support."
  }
];

export function getBlogPostBySlug(slug) {
  const normalizedSlug = normalizeSlug(slug);
  return blogPosts.find((post) => normalizeSlug(post.slug) === normalizedSlug);
}

function normalizeSlug(value) {
  return decodeURIComponent(String(value || "")).trim().toLowerCase();
}

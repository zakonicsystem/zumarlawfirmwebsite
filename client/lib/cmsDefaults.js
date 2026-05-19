import { blogPosts, categories, internationalServices, newsItems, services, slugify } from "./services";
import { branches, serviceAreas } from "./services";
import { defaultSeoPages } from "./seoDefaults";

export const defaultHomeSections = [
  {
    id: "hero",
    tab: "Hero",
    eyebrow: "Tax, corporate and licensing services",
    title: "Zumar Law Firm",
    copy:
      "A cleaner way to handle registrations, tax filings, compliance documents, intellectual property, and regulatory licenses with one accountable team.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85",
    enabled: true
  },
  {
    id: "featured",
    tab: "Featured",
    eyebrow: "Featured services",
    title: "Browse services in motion.",
    copy:
      "Move through key services with a professional carousel, then open any service page for price and document requirements from the app data file.",
    enabled: true
  },
  {
    id: "process",
    tab: "Process",
    eyebrow: "How it works",
    title: "Structured support from first call to final filing.",
    copy:
      "The public website explains each service clearly. The admin panel controls service, blog, news, appointment, and core page content.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85",
    enabled: true
  },
  {
    id: "services",
    tab: "Services",
    eyebrow: "All services",
    title: "Find the exact legal, tax, or registration service.",
    copy: "Browse public service pages by category, price, and required documents.",
    enabled: true
  },
  {
    id: "updates",
    tab: "Updates",
    eyebrow: "News and blog",
    title: "Authority updates and completed cases.",
    copy: "Latest legal authority notes and case-style blog posts from Zumar Law Firm.",
    enabled: true
  }
];

export const defaultHeroSlides = [
  {
    eyebrow: "Legal, Tax & Corporate Services",
    title: "Practical legal support for business and compliance.",
    copy:
      "Start registrations, filings, licensing, intellectual property, and regulatory work with a team focused on clear documents and timely follow-up.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1800&q=85",
    primaryLabel: "Explore Services",
    primaryHref: "/services",
    secondaryLabel: "Book Appointment",
    secondaryHref: "/appointment",
    enabled: true
  },
  {
    eyebrow: "Business Registration",
    title: "Company, tax, and licensing work handled in one place.",
    copy:
      "Move from consultation to document checklist, portal submission, and authority follow-up without losing track of the next step.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85",
    primaryLabel: "View Practice Areas",
    primaryHref: "/service-areas",
    secondaryLabel: "Contact Team",
    secondaryHref: "/contact",
    enabled: true
  },
  {
    eyebrow: "Client Portal Ready",
    title: "A cleaner workflow for documents, filings, and updates.",
    copy:
      "Use the website to understand requirements, then continue through the client portal for account-based service submission.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85",
    primaryLabel: "Create Account",
    primaryHref: "https://app.zumarlawfirm.com/signup",
    secondaryLabel: "Read FAQs",
    secondaryHref: "/faqs",
    enabled: true
  }
];

export const defaultHomeStats = [
  {
    icon: "tax",
    value: "5,600 +",
    label: "Tax Filings",
    enabled: true
  },
  {
    icon: "building",
    value: "4,000 +",
    label: "Business Registrations",
    enabled: true
  },
  {
    icon: "filing",
    value: "1,500 +",
    label: "Compliance Matters",
    enabled: true
  },
  {
    icon: "globe",
    value: "10 +",
    label: "Regulatory Areas",
    enabled: true
  }
];

export const defaultHomeContent = {
  sharedProcess: {
    enabled: true,
    eyebrow: "How we work",
    title: "A structured workflow for every service request.",
    copy:
      "Every matter starts with scope, documents, and next steps. That keeps communication clean and reduces unnecessary delays.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85",
    steps: [
      { number: "01", title: "Choose a service", copy: "Browse the full catalog by category, price, and required documents.", enabled: true },
      { number: "02", title: "Submit details", copy: "Start from the client portal or schedule a consultation first.", enabled: true },
      { number: "03", title: "Team review", copy: "Your documents are checked before filing or registration work continues.", enabled: true },
      { number: "04", title: "Completion", copy: "The team follows up until the service is completed or the next step is clear.", enabled: true }
    ]
  },
  whyChoose: {
    enabled: true,
    eyebrow: "Why Choose Us",
    title: "Built for businesses, professionals, and taxpayers who need dependable advisory.",
    copy:
      "Zumar Law Firm helps clients handle registrations, tax filings, corporate compliance, licensing, and regulatory documentation with practical guidance and organized follow-up.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    panelTitle: "Tax, corporate, registration, and compliance work with a structured process.",
    primaryLabel: "Book Consultation",
    primaryHref: "/appointment",
    secondaryLabel: "View Services",
    secondaryHref: "/services",
    strengths: [
      { label: "Tax Registration & Returns", value: "92%", enabled: true },
      { label: "Company & SECP Services", value: "88%", enabled: true },
      { label: "Licensing & Compliance", value: "95%", enabled: true },
      { label: "IP, PSEB & Chamber Work", value: "85%", enabled: true }
    ],
    benefits: [
      { icon: "check", text: "Tax and corporate specialists", enabled: true },
      { icon: "check", text: "Clear document checklists", enabled: true },
      { icon: "check", text: "Online client portal", enabled: true },
      { icon: "check", text: "Direct filing follow-up", enabled: true },
      { icon: "check", text: "Transparent service pricing", enabled: true },
      { icon: "check", text: "Support for both offices", enabled: true },
      { icon: "check", text: "National and international services", enabled: true },
      { icon: "check", text: "Practical compliance guidance", enabled: true }
    ]
  },
  processSteps: [
    { number: "01", title: "Choose a service", copy: "Browse the full catalog by category, price, and required documents.", enabled: true },
    { number: "02", title: "Submit details", copy: "Start from the client portal or schedule a consultation first.", enabled: true },
    { number: "03", title: "Team review", copy: "Your documents are checked before filing or registration work continues.", enabled: true },
    { number: "04", title: "Completion", copy: "The team follows up until the service is completed or the next step is clear.", enabled: true }
  ],
  serviceAreas: {
    enabled: true,
    eyebrow: "Service areas",
    title: "Focused tax, corporate, and regulatory support.",
    buttonText: "View All Areas",
    buttonHref: "/service-areas",
    limit: "4"
  },
  testimonials: {
    enabled: true,
    eyebrow: "Client Testimonials",
    title: "Trusted by taxpayers, founders, and growing businesses.",
    copy:
      "Clients choose Zumar Law Firm for practical documentation, clear pricing, and follow-up across tax, corporate, registration, and compliance work.",
    items: [
      {
        icon: "tax",
        name: "Business Owner",
        role: "Corporate Registration Client",
        quote:
          "The team explained the complete registration process, shared a clear document checklist, and kept our company filing moving without confusion.",
        rating: "5",
        enabled: true
      },
      {
        icon: "receipt",
        name: "Taxpayer Client",
        role: "Income Tax Filing",
        quote:
          "My tax return and profile work were handled with practical guidance. The communication was direct and the requirements were easy to understand.",
        rating: "5",
        enabled: true
      },
      {
        icon: "globe",
        name: "Freelance Professional",
        role: "PSEB & Compliance Support",
        quote:
          "Zumar Law Firm helped us understand the service steps, prepare details correctly, and complete the compliance process through organized follow-up.",
        rating: "5",
        enabled: true
      },
      {
        icon: "building",
        name: "Startup Founder",
        role: "SECP Company Incorporation",
        quote:
          "The incorporation process was explained clearly from name reservation to documentation. Their follow-up made the steps much easier to manage.",
        rating: "5",
        enabled: true
      },
      {
        icon: "certificate",
        name: "Import Business Client",
        role: "Licensing & Registration",
        quote:
          "We received practical guidance for the registration requirements and supporting documents. The team kept the process organized throughout.",
        rating: "5",
        enabled: true
      },
      {
        icon: "headset",
        name: "SME Client",
        role: "Ongoing Compliance Advisory",
        quote:
          "Their team is responsive and professional. We use them for compliance questions because they give direct answers and clear next steps.",
        rating: "5",
        enabled: true
      }
    ]
  },
  updates: {
    enabled: true,
    newsEyebrow: "News",
    newsTitle: "Authority updates.",
    newsButtonText: "All News",
    newsButtonHref: "/news",
    blogEyebrow: "Blog",
    blogTitle: "Completed matters.",
    blogButtonText: "All Blogs",
    blogButtonHref: "/blog"
  },
  branches: {
    enabled: true,
    eyebrow: "Branches",
    title: "Visit Zumar Law Firm.",
    buttonText: "View Branches",
    buttonHref: "/branches",
    limit: "2"
  }
};

export const defaultAboutContent = {
  eyebrow: "About",
  title: "Zumar Law Firm",
  copy: "A professional services firm focused on tax, business registration, regulatory licensing, intellectual property, and compliance support for individuals, startups, companies, NGOs, freelancers, and professionals.",
  image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85",
  imageOverlayEyebrow: "Document-first advisory",
  imageOverlayTitle: "Tax, corporate, licensing, and compliance support.",
  introEyebrow: "About the firm",
  introTitle: "Practical advisory built around clear documents and accountable follow-up.",
  introCopy:
    "Zumar Law Firm supports individuals, startups, companies, freelancers, NGOs, and professionals with the legal and compliance work needed to operate confidently. The firm combines service catalog clarity with portal-based intake, checklist-driven documentation, and direct communication.",
  introSecondCopy:
    "Our work covers tax registrations and returns, company and SECP matters, intellectual property, PSEB, chamber memberships, import/export licensing, and regulatory registrations for local and international service needs.",
  processEyebrow: "How we work",
  processTitle: "A structured workflow for every service request.",
  processCopy:
    "Every matter starts with scope, documents, and next steps. That keeps communication clean and reduces unnecessary delays.",
  stats: [
    { value: "50+", label: "Service categories" },
    { value: "2", label: "Branch offices" },
    { value: "Online", label: "Client portal" }
  ],
  highlights: [
    {
      icon: "filing",
      title: "Document-first workflow",
      copy: "Each matter starts with a clear checklist so clients know what to prepare before filing begins."
    },
    {
      icon: "headset",
      title: "Practical follow-up",
      copy: "The team keeps cases moving with portal-based communication and direct status updates."
    }
  ],
  teamPreview: {
    eyebrow: "Team",
    title: "Main members of the team behind your filings.",
    copy: "Meet the people who coordinate client intake, document review, tax and corporate filings, regulatory follow-up, and service progress across the firm.",
    buttonText: "Meet the Team",
    buttonHref: "/team"
  },
  sections: [
    {
      id: "work",
      icon: "scale",
      title: "Our Work",
      copy:
        "Zumar Law Firm helps individuals, freelancers, business owners, companies, NGOs, and professionals complete important legal and compliance steps with clearer documentation and practical follow-up."
    },
    {
      id: "areas",
      icon: "building",
      title: "Service Areas",
      copy:
        "The firm covers NTN registration, income tax returns, GST and PST registration, company registration, PSEB registration, chamber memberships, intellectual property, import export licensing, and multiple regulatory registrations."
    },
    {
      id: "portal",
      icon: "lock",
      title: "Digital Client Portal",
      copy:
        "The client portal remains available for account creation, login, document submission, payment workflow, and service progress."
    }
  ]
};

export const defaultPageContent = {
  services: {
    label: "Services",
    eyebrow: "Service catalog",
    title: "All Services",
    copy: "Browse public service pages using the same service data used by the admin panel."
  },
  serviceDetail: {
    label: "Service Detail",
    eyebrowFallback: "Service",
    overviewTitle: "Service Overview",
    overviewCopy:
      "Zumar Law Firm assists with eligibility review, document preparation, filing guidance, and follow-up for this service. Requirements below are pulled from the service data file used by the existing app.",
    processTitle: "How this service is handled",
    processSteps: [
      "Confirm service scope and required authority.",
      "Collect CNIC, business, and supporting records.",
      "Prepare filing details and submit through the relevant portal.",
      "Follow up until completion or next compliance step."
    ],
    requirementsTitle: "Required Details / Documents",
    emptyRequirementsText: "Requirements are confirmed during consultation because this service may vary by case.",
    feeLabel: "Professional fee",
    timelineLabel: "Timeline",
    feeNote: "Final government fees, challans, and case-specific expenses may vary where applicable.",
    startOnlineLabel: "Start Online",
    startOnlineHref: "https://app.zumarlawfirm.com/signup",
    appointmentLabel: "Appointment",
    appointmentHref: "/appointment",
    callLabel: "Call +92 303 598 8574",
    callHref: "tel:+923035988574",
    whatsappLabel: "WhatsApp",
    whatsappPhone: "923035988574",
    relatedEyebrow: "Related services",
    relatedTitle: "You may also need these services.",
    allServicesLabel: "All Services"
  },
  serviceAreas: {
    label: "Service Areas",
    eyebrow: "Service Areas",
    title: "Focused practice areas",
    copy: "Explore the core service areas covered by Zumar Law Firm across tax, corporate, licensing, and intellectual property work."
  },
  serviceAreaDetail: {
    label: "Service Area Detail",
    eyebrow: "Service Area",
    relatedTitle: "Related Services"
  },
  branches: {
    label: "Branches",
    eyebrow: "Branches",
    title: "Visit our offices",
    copy: "Zumar Law Firm serves clients through Lahore and Rawalpindi/Islamabad branches."
  },
  branchDetail: {
    label: "Branch Detail",
    eyebrow: "Branch Office",
    detailsEyebrow: "Visit Our Office",
    detailsTitle: "Branch Details",
    detailsCopy: "Connect with Zumar Law Firm through this branch for tax, corporate, registration, compliance, and consultation support.",
    supportTitle: "Need branch support?",
    supportCopy: "Book a consultation and our team will guide you about documents, service scope, and next steps.",
    appointmentLabel: "Book Appointment",
    consultationLabel: "Request Consultation",
    mapLabel: "Open in Google Maps"
  },
  blog: {
    label: "Blog",
    eyebrow: "Blog",
    title: "Cases we complete",
    copy: "Completed service matters from Zumar Law Firm covering registrations, filings, licensing, and intellectual property work."
  },
  news: {
    label: "News",
    eyebrow: "News",
    title: "Pakistan legal authority updates",
    copy: "Daily updates and compliance reminders covering FBR, DTS, SECP, provincial revenue authorities, and other regulators."
  },
  appointment: {
    label: "Appointment",
    eyebrow: "Appointment",
    title: "Book a consultation",
    copy: "Select a service, prepare your basic documents, and start from the portal or contact page.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=85",
    sideTitle: "Before the appointment",
    checklist: [
      "Choose the relevant service from the catalog.",
      "Keep CNIC, email, phone number, and business details ready.",
      "Use the client portal for account-based service submission.",
      "Use contact if you need confirmation before starting."
    ],
    startOnlineLabel: "Start Online",
    startOnlineHref: "https://app.zumarlawfirm.com/signup",
    contactLabel: "Contact First",
    contactHref: "/contact",
    formTitle: "Appointment Request",
    submitLabel: "Submit Appointment",
    successText: "Appointment request submitted.",
    errorText: "Unable to submit appointment."
  },
  team: {
    label: "Team",
    eyebrow: "Team",
    title: "Meet the people behind the work",
    copy: "A focused professional team handling client intake, documentation, filing, and regulatory follow-up.",
    ceoEyebrow: "Leadership",
    ceoName: "Chief Executive Officer",
    ceoRole: "CEO, Zumar Law Firm",
    ceoImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85",
    ceoBio:
      "The CEO leads client service standards, documentation discipline, and practical advisory across tax, corporate registration, licensing, intellectual property, and compliance matters.",
    historyEyebrow: "History",
    historyTitle: "Built around practical filing support",
    historyCopy:
      "Zumar Law Firm grew from everyday tax and registration support into a wider advisory practice for individuals, startups, companies, NGOs, freelancers, and professionals. The firm continues to focus on clear requirements, organized records, and accountable follow-up.",
    history: [
      { year: "Foundation", title: "Tax and registration support", copy: "The firm began with practical support for NTN, income tax, business registration, and client documentation." },
      { year: "Expansion", title: "Corporate and licensing services", copy: "Service coverage expanded into company registration, chamber matters, PSEB, import/export, and intellectual property support." },
      { year: "Today", title: "Portal-based client workflow", copy: "The website and client portal help clients understand requirements, start service requests, and track communication more clearly." }
    ],
    members: [
      {
        name: "Zumar Law Firm Team",
        designation: "Tax & Corporate Consultants",
        role: "Tax & Corporate Consultants",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
        bio: "Coordinates registrations, tax filings, compliance documentation, and client communication across service categories."
      },
      {
        name: "Documentation Desk",
        designation: "Client Records & Filing",
        role: "Client Records & Filing",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85",
        bio: "Reviews required details, prepares checklists, and keeps supporting records organized before submission."
      },
      {
        name: "Regulatory Support",
        designation: "Licensing & Follow-up",
        role: "Licensing & Follow-up",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85",
        bio: "Tracks authority requirements and supports follow-up for licensing, registrations, and compliance matters."
      }
    ]
  },
  contact: {
    label: "Contact",
    eyebrow: "Contact",
    title: "Talk to the team",
    copy: "Send your service query or start directly from the online client portal.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=85",
    formTitle: "Inquiry Form",
    formCopy:
      "This frontend form is ready for backend integration. For active submission, connect it to the Node.js contact endpoint used by the app.",
    links: [
      { icon: "lock", title: "Client Portal", href: "https://app.zumarlawfirm.com/login", text: "app.zumarlawfirm.com/login" },
      { icon: "registration", title: "Create Account", href: "https://app.zumarlawfirm.com/signup", text: "app.zumarlawfirm.com/signup" },
      { icon: "appointment", title: "Appointment", href: "/appointment", text: "Book a consultation request" }
    ]
  },
  calculators: {
    label: "Calculators",
    eyebrow: "Tax Calculators",
    title: "Estimate salary and business tax",
    copy: "Use quick Pakistan tax estimators for salaried income and individual/AOP business income. These tools are for planning only; final tax can change based on deductions, credits, filer status, surcharges, and the applicable tax year.",
    disclaimer:
      "Estimator only. Do not treat this as legal or tax advice. Confirm exact liability with Zumar Law Firm before filing or making payment.",
    salaryTitle: "Salary Tax Calculator",
    salaryCopy: "Estimate annual and monthly tax for salaried income from tax year 2022 to 2026.",
    businessTitle: "Business Tax Calculator",
    businessCopy: "Estimate individual or AOP business income tax from tax year 2022 to 2026.",
    consultationLabel: "Review With Tax Team",
    consultationHref: "/appointment"
  },
  careers: {
    label: "Careers",
    eyebrow: "Careers",
    title: "Build practical legal, tax, and corporate service experience",
    copy: "Join a focused team serving clients across registration, tax filing, licensing, intellectual property, and regulatory compliance work.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    introEyebrow: "Why Work With Us",
    introTitle: "Grow with structured client work",
    introCopy:
      "Zumar Law Firm is suited for people who enjoy organized documentation, practical regulatory work, and direct client support. Our team handles real service workflows across tax, corporate, licensing, and compliance matters.",
    openingsEyebrow: "Open Roles",
    openingsTitle: "Current opportunities",
    openingsButtonText: "Apply Through Contact Form",
    openingsButtonHref: "/contact",
    processEyebrow: "Application Process",
    processTitle: "Simple, clear, and practical",
    processCopy:
      "Share your profile with the service area you are interested in. We review candidates based on communication, attention to detail, and ability to handle structured documentation.",
    openings: [
      {
        icon: "tax",
        title: "Tax Filing Associate",
        type: "Full time",
        location: "Lahore / Rawalpindi",
        summary: "Support NTN, income tax return, sales tax, and compliance filing matters with careful document review and client follow-up."
      },
      {
        icon: "building",
        title: "Corporate Registration Executive",
        type: "Full time",
        location: "Hybrid",
        summary: "Assist with SECP, business registration, chamber, licensing, and post-registration documentation for growing businesses."
      },
      {
        icon: "headset",
        title: "Client Support Coordinator",
        type: "Office based",
        location: "Lahore / Rawalpindi",
        summary: "Guide clients through required details, service selection, appointment scheduling, and portal-based service submissions."
      }
    ],
    values: [
      { icon: "filing", title: "Organized work", copy: "We value clean records, clear checklists, and reliable follow-up." },
      { icon: "shield", title: "Client trust", copy: "Confidential handling of client information is part of every role." },
      { icon: "globe", title: "Modern service delivery", copy: "Our work connects office support, online intake, and regulatory process tracking." }
    ],
    steps: [
      "Send your CV and area of interest.",
      "Shortlisted candidates complete a practical screening call.",
      "Final candidates meet the team and discuss role fit."
    ]
  },
  faqs: {
    label: "FAQs",
    eyebrow: "Frequently Asked Questions",
    title: "Questions about Zumar Law Firm services",
    copy: "Find answers about tax filings, company registration, licensing, compliance, pricing, appointments, and the client portal.",
    sideTitle: "Questions before you start?",
    sideCopy: "These answers cover service scope, documents, pricing, appointments, branch support, and the client portal.",
    sidePhone: "+92 303 598 8574",
    sideEmail: "team@zumarlawfirm.com",
    items: [
      {
        icon: "lock",
        question: "Can I start a service online?",
        answer: "Yes. Use the client portal at app.zumarlawfirm.com to create an account and submit service details."
      },
      {
        icon: "receipt",
        question: "Are prices fixed?",
        answer: "Listed prices come from the service data file. Government fees, challans, or special case expenses may vary."
      },
      {
        icon: "filing",
        question: "Where are document requirements shown?",
        answer: "Each service page lists the required details and documents pulled from the app data file."
      },
      {
        icon: "appointment",
        question: "Can I ask before submitting documents?",
        answer: "Yes. Use the appointment or contact page before starting through the portal."
      },
      {
        icon: "tax",
        question: "Do you handle income tax registration and returns?",
        answer: "Yes. Zumar Law Firm supports NTN registration, income tax return filing, profile updates, and related tax compliance work for individuals, businesses, freelancers, professionals, and companies."
      },
      {
        icon: "building",
        question: "Can you help register a company with SECP?",
        answer: "Yes. The firm assists with company name reservation, incorporation documents, SECP filing guidance, post-incorporation compliance, and related tax registration steps."
      },
      {
        icon: "certificate",
        question: "Do you provide licensing and regulatory registration services?",
        answer: "Yes. Services include PSEB, chamber memberships, import/export related registrations, intellectual property, provincial tax registrations, and other regulatory documentation depending on the business type."
      },
      {
        icon: "globe",
        question: "Do you support international service matters?",
        answer: "Yes. The website includes national and international services. International matters may require extra review because documents, fees, timelines, and authority requirements can vary by jurisdiction."
      },
      {
        icon: "phone",
        question: "How can I contact the team quickly?",
        answer: "You can call or WhatsApp +92 303 598 8574. You can also use the appointment page for a structured consultation request or email team@zumarlawfirm.com."
      },
      {
        icon: "landmark",
        question: "Do you have more than one office?",
        answer: "Yes. Zumar Law Firm serves clients through multiple offices. You can view branch details, phone numbers, email, and address information on the Branches page."
      },
      {
        icon: "id",
        question: "Which basic details are usually required?",
        answer: "Common details include CNIC, name, phone number, email, address, business name, business activity, registration information, and supporting documents. Exact requirements depend on the selected service."
      },
      {
        icon: "shield",
        question: "Is my information kept confidential?",
        answer: "Client information should be used only for service evaluation, document preparation, filing, account management, and related communication. Sensitive documents should be shared only through trusted channels."
      },
      {
        icon: "headset",
        question: "Will the team guide me after submission?",
        answer: "Yes. After details are submitted, the team reviews the request, confirms missing information, explains the next step, and follows up according to the service workflow."
      },
      {
        icon: "stamp",
        question: "Can timelines be guaranteed?",
        answer: "Timelines depend on document readiness, client response time, government portals, regulator availability, and case complexity. The team can provide practical expectations after reviewing the service details."
      },
      {
        icon: "trademark",
        question: "Do you handle trademark or intellectual property work?",
        answer: "Yes. The firm supports intellectual property related services including trademark guidance, document preparation, and follow-up based on the requirements of the relevant authority."
      },
      {
        icon: "registration",
        question: "Can I create a portal account myself?",
        answer: "Yes. You can create a client account from the signup link and begin service submission online. If you are unsure what to choose, contact the team first."
      },
      {
        icon: "check",
        question: "What happens if my documents are incomplete?",
        answer: "The team will identify missing or incorrect details and guide you on what to provide. Work usually moves faster when documents are complete and accurate at the start."
      },
      {
        icon: "email",
        question: "Can I send documents by email or WhatsApp?",
        answer: "For initial guidance, you may contact the team by email or WhatsApp. For organized service processing, the client portal is preferred where account-based submission is available."
      }
    ]
  },
  privacyPolicy: {
    label: "Privacy Policy",
    eyebrow: "Policy",
    title: "Privacy Policy",
    copy:
      "Zumar Law Firm collects client information only for service evaluation, document preparation, filing, account management, and communication related to requested services.",
    sections: [
      {
        icon: "id",
        title: "Information We Use",
        copy:
          "Information may include names, phone numbers, email addresses, CNIC details, business details, service documents, payment references, and communication records."
      },
      {
        icon: "shield",
        title: "Data Protection",
        copy:
          "Client data should be accessed only by authorized team members and used for the purpose for which it was submitted. Sensitive documents should not be shared publicly."
      },
      {
        icon: "lock",
        title: "Client Portal",
        copy:
          "Portal users are responsible for keeping login credentials private and ensuring that uploaded documents are accurate and lawful to submit."
      }
    ]
  },
  refundPolicy: {
    label: "Refund Policy",
    eyebrow: "Policy",
    title: "Refund Policy",
    copy:
      "Refund requests are reviewed according to service status, work already performed, payment records, and any government or third-party fee already paid.",
    sections: [
      {
        icon: "appointment",
        title: "Before Work Starts",
        copy: "If no professional work, filing, or third-party payment has started, a refund request may be eligible after verification."
      },
      {
        icon: "filing",
        title: "After Work Starts",
        copy:
          "Once document review, preparation, filing, or regulatory submission has started, deductions may apply for completed work and non-refundable expenses."
      },
      {
        icon: "headset",
        title: "How to Request",
        copy:
          "Existing clients can request refund support through the app portal or contact the team with their service and payment reference details."
      }
    ]
  },
  termsAndConditions: {
    label: "Terms & Conditions",
    eyebrow: "Policy",
    title: "Terms & Conditions",
    copy:
      "By using this website or the client portal, you agree to provide correct information, submit valid documents, and cooperate with reasonable requests required to complete a service.",
    sections: [
      {
        icon: "filing",
        title: "Service Scope",
        copy:
          "Service timelines and outcomes may depend on client response time, government portals, regulator availability, and completeness of documents."
      },
      {
        icon: "tax",
        title: "Pricing",
        copy:
          "Displayed prices are professional service charges from the data file unless stated otherwise. Government fees, challans, penalties, and case-specific expenses may be separate."
      },
      {
        icon: "certificate",
        title: "Accuracy",
        copy:
          "Clients are responsible for the accuracy and authenticity of all information and documents submitted for filing, registration, or compliance work."
      }
    ]
  }
};

function normalizeService(service) {
  return {
    id: service.slug,
    title: service.title,
    slug: service.slug,
    category: service.category,
    icon: service.icon || "scale",
    image: service.image || "",
    price: service.price || "",
    timeline: service.timeline || "",
    summary: service.summary,
    requirements: service.requirements || [],
    serviceType: service.serviceType || "national",
    metaTitle: service.metaTitle || "",
    metaDescription: service.metaDescription || "",
    enabled: service.enabled !== false
  };
}

function normalizeArticle(item, type) {
  return {
    id: item.slug,
    title: item.title,
    slug: item.slug,
    date: item.date,
    image: item.image,
    summary: item.summary,
    body: item.body || item.summary,
    authority: item.authority || "",
    service: item.service || "",
    type,
    enabled: item.enabled !== false
  };
}

export function makeCmsDefaults() {
  return {
    settings: {
      updatedAt: new Date().toISOString(),
      adminEmail: "admin@zumarlawfirm.com",
      adminPassword: "admin123",
      socialLinks: [
        { label: "Facebook", href: "https://www.facebook.com/zumarlawfirm", enabled: true },
        { label: "TikTok", href: "https://www.tiktok.com/@zumarlawfirmofficial", enabled: true },
        { label: "YouTube", href: "https://www.youtube.com/@zumarlawfirm", enabled: true },
        { label: "Instagram", href: "https://www.instagram.com/zumarlawfirm", enabled: true }
      ]
    },
    seoPages: defaultSeoPages,
    pageContent: defaultPageContent,
    categories,
    homeSections: defaultHomeSections,
    heroSlides: defaultHeroSlides,
    homeStats: defaultHomeStats,
    homeContent: defaultHomeContent,
    about: defaultAboutContent,
    branches,
    serviceAreas,
    services: [...services.map((service) => ({ ...service, serviceType: "national" })), ...internationalServices].map(normalizeService),
    blogs: blogPosts.map((item) => normalizeArticle(item, "blog")),
    news: newsItems.map((item) => normalizeArticle(item, "news")),
    appointments: []
  };
}

export function makeSlug(value) {
  return slugify(value || `item-${Date.now()}`);
}

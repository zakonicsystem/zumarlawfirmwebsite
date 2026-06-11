"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FaIcon from "@/components/FaIcon";
import RichTextEditor from "@/components/RichTextEditor";
import { makeSlug } from "@/lib/cmsDefaults";
import { defaultPageContent } from "@/lib/cmsDefaults";
import { defaultSeoPages } from "@/lib/seoDefaults";

const iconOptions = [
  "appointment",
  "arrowLeft",
  "arrowRight",
  "arms",
  "balance",
  "building",
  "business",
  "certificate",
  "check",
  "chamber",
  "copyright",
  "email",
  "faq",
  "filing",
  "fingerprint",
  "gavel",
  "globe",
  "handshake",
  "headset",
  "id",
  "landmark",
  "labour",
  "lock",
  "phone",
  "receipt",
  "registration",
  "ranking",
  "scale",
  "search",
  "shield",
  "stamp",
  "star",
  "tax",
  "trophy",
  "trademark"
];

const emptyService = {
  title: "",
  slug: "",
  category: "NTN",
  icon: "scale",
  image: "",
  price: "",
  timeline: "",
  summary: "",
  overviewTitle: "",
  overviewCopy: "",
  processTitle: "",
  processSteps: [],
  relatedServiceSlugs: [],
  carouselServiceSlugs: [],
  requirements: [],
  benefits: [],
  eligibility: [],
  faqItems: [],
  metaTitle: "",
  metaDescription: "",
  enabled: true
};

const emptyArticle = {
  title: "",
  slug: "",
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  image: "",
  summary: "",
  body: "",
  authority: "",
  service: "",
  metaTitle: "",
  metaDescription: "",
  enabled: true
};

const navItems = [
  ["Dashboard", "/admin", "scale"],
  ["Settings", "/admin/settings", "lock"],
  ["SEO", "/admin/seo", "search"],
  ["Services", "/admin/services", "scale"],
  ["New Service", "/admin/services/new", "registration"],
  ["Blogs", "/admin/blogs", "certificate"],
  ["New Blog", "/admin/blogs/new", "registration"]
];

const pageSidebarItems = [
  ["Home", "/admin/home", "building"],
  ["About", "/admin/about", "landmark"],
  ["CEO & History", "/admin/pages?page=team", "landmark"],
  ["Services", "/admin/pages?page=services", "scale"],
  ["Calculators", "/admin/pages?page=calculators", "tax"],
  ["Service Areas", "/admin/pages?page=serviceAreas", "filing"],
  ["Service Area Detail", "/admin/pages?page=serviceAreaDetail", "filing"],
  ["Branches", "/admin/pages?page=branches", "landmark"],
  ["Branch Detail", "/admin/pages?page=branchDetail", "landmark"],
  ["Blog", "/admin/pages?page=blog", "certificate"],
  ["Appointment", "/admin/pages?page=appointment", "appointment"],
  ["Contact", "/admin/pages?page=contact", "headset"],
  ["Careers", "/admin/pages?page=careers", "business"],
  ["Service Detail", "/admin/pages?page=serviceDetail", "filing"],
  ["Privacy Policy", "/admin/pages?page=privacyPolicy", "lock"],
  ["Refund Policy", "/admin/pages?page=refundPolicy", "registration"],
  ["Terms & Conditions", "/admin/pages?page=termsAndConditions", "filing"]
];

function normalizeStringList(items = []) {
  return [...new Set((items || []).map((item) => String(item || "").trim()).filter(Boolean))];
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@zumarlawfirm.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const payload = await response.json();
      localStorage.setItem("zumar-admin-auth", "true");
      localStorage.setItem("zumar-admin-token", payload.token || "");
      router.push("/admin");
      return;
    }

    setError("Invalid admin login.");
  }

  return (
    <section className="min-h-[calc(100vh-80px)] bg-paper py-16">
      <form onSubmit={submit} autoComplete="off" className="mx-auto grid w-[min(460px,calc(100%-32px))] gap-5 rounded-[1.5rem] border border-primary/10 bg-white p-7 shadow-2xl shadow-primary/10">
        <div>
          <p className="text-sm font-black uppercase text-primary">Admin Login</p>
          <h1 className="mt-2 text-4xl font-black text-primary">Zumar CMS</h1>
        </div>
        <Field label="Email" value={email} onChange={setEmail} autoComplete="username" />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
        <button className="min-h-12 rounded-full bg-primary px-6 text-sm font-black text-white">Login</button>
      </form>
    </section>
  );
}

export default function AdminClient({ view, editId }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => {
    function handleToast(event) {
      showToast(event.detail?.message || "Changes updated.", event.detail?.type || "success");
    }

    window.addEventListener("zumar-admin-toast", handleToast);
    return () => window.removeEventListener("zumar-admin-toast", handleToast);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("zumar-admin-auth") !== "true") {
      router.push("/admin/login");
      return;
    }

    fetch("/api/admin/content", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("zumar-admin-token") || ""}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("zumar-admin-auth");
            localStorage.removeItem("zumar-admin-token");
            router.push("/admin/login");
            return Promise.reject("Unauthorized");
          }
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        setData(payload);
        setStatus("");
        const pendingToast = sessionStorage.getItem("zumar-admin-toast");
        if (pendingToast) {
          sessionStorage.removeItem("zumar-admin-toast");
          showToast(pendingToast);
        }
      })
      .catch(() => setStatus("Unable to load CMS content."));
  }, [router]);

  async function save(nextData = data, message = "Changes saved.", persistToast = false) {
    setStatus("Saving...");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("zumar-admin-token") || ""}`
      },
      body: JSON.stringify(nextData)
    });
    const payload = await response.json();
    if (!response.ok) {
      const errorMessage = payload.error || "Unable to save changes.";
      setStatus(errorMessage);
      showToast(errorMessage, "error");
      throw new Error(errorMessage);
    }

    setData(payload);
    setStatus("Saved.");
    if (persistToast) {
      sessionStorage.setItem("zumar-admin-toast", message);
    }
    showToast(message);
    setTimeout(() => setStatus(""), 1800);
    return payload;
  }

  function updateData(key, value) {
    setData((current) => ({ ...current, [key]: value }));
  }

  if (!data) {
    return <AdminFrame status={status}> </AdminFrame>;
  }

  const id = editId;

  return (
    <AdminFrame status={status} toast={toast} onLogout={() => {
      localStorage.removeItem("zumar-admin-auth");
      localStorage.removeItem("zumar-admin-token");
      router.push("/admin/login");
    }}>
      {view === "dashboard" && data ? <Dashboard data={data} /> : null}
      {view === "settings" && data ? <SettingsEditor data={data} updateData={updateData} save={save} /> : null}
      {view === "home" && data ? <HomeEditor data={data} updateData={updateData} save={save} /> : null}
      {view === "about" && data ? <AboutEditor data={data} updateData={updateData} save={save} /> : null}
      {view === "pages" && data ? <PageContentEditor data={data} updateData={updateData} save={save} initialPage={id} /> : null}
      {view === "seo" && data ? <SeoEditor data={data} updateData={updateData} save={save} /> : null}
      {view === "services" && data ? <ServiceList data={data} save={save} /> : null}
      {view === "serviceForm" && data ? <ServiceForm data={data} id={id} save={save} /> : null}
      {view === "blogs" && data ? <ArticleList type="blogs" data={data} save={save} /> : null}
      {view === "blogForm" && data ? <ArticleForm type="blogs" data={data} id={id} save={save} /> : null}
      {view === "news" && data ? <ArticleList type="news" data={data} save={save} /> : null}
      {view === "newsForm" && data ? <ArticleForm type="news" data={data} id={id} save={save} /> : null}
      {view === "appointments" && data ? <Appointments data={data} save={save} /> : null}
    </AdminFrame>
  );
}

function PageContentEditor({ data, updateData, save, initialPage }) {
  if (!data) return null;
  const pages = { ...defaultPageContent, ...(data.pageContent || {}) };
  const pageKeys = Object.keys(pages);
  const pageKeySignature = pageKeys.join("|");
  const [active, setActive] = useState(pageKeys.includes(initialPage) ? initialPage : pageKeys[0]);
  const page = pages[active] || pages.services;

  useEffect(() => {
    if (pageKeys.includes(initialPage)) {
      setActive(initialPage);
    }
  }, [initialPage, pageKeySignature]);

  function updatePage(field, value) {
    updateData("pageContent", {
      ...pages,
      [active]: { ...page, [field]: value }
    });
  }

  function updatePageList(listKey, index, field, value) {
    const items = page[listKey] || [];
    updatePage(
      listKey,
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function addPageListItem(listKey, item) {
    updatePage(listKey, [...(page[listKey] || []), item]);
  }

  function removePageListItem(listKey, index) {
    updatePage(
      listKey,
      (page[listKey] || []).filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateCollection(key, index, field, value) {
    const currentItem = (data[key] || [])[index] || {};
    const nextValue = field === "slug" ? makeSlug(value) : value;
    const shouldAutoSlug =
      ["title", "name"].includes(field) &&
      (!currentItem.slug || currentItem.slug === makeSlug(currentItem.title || currentItem.name || ""));

    updateData(
      key,
      (data[key] || []).map((item, itemIndex) =>
        itemIndex === index
          ? {
            ...item,
            [field]: nextValue,
            ...(shouldAutoSlug ? { slug: makeSlug(value) } : {})
          }
          : item
      )
    );
  }

  function addCollectionItem(key, item) {
    updateData(key, [...(data[key] || []), item]);
  }

  function removeCollectionItem(key, index) {
    updateData(
      key,
      (data[key] || []).filter((_, itemIndex) => itemIndex !== index)
    );
  }

  return (
    <Editor title="Page Content" onSave={() => save()}>
      <div className="mb-5 flex flex-wrap gap-2">
        {pageKeys.map((key) => (
          <button className={`rounded-full px-4 py-2 text-sm font-black ${key === active ? "bg-primary text-white" : "bg-paper text-primary"}`} onClick={() => setActive(key)} key={key}>
            {pages[key].label}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {"eyebrow" in page ? <RichEditor label="Eyebrow" value={page.eyebrow} onChange={(value) => updatePage("eyebrow", value)} /> : null}
        {"title" in page ? <RichEditor label="Page Title" value={page.title} onChange={(value) => updatePage("title", value)} /> : null}
        {"copy" in page ? <RichEditor label="Page Copy" value={page.copy} onChange={(value) => updatePage("copy", value)} /> : null}

        {active === "appointment" ? (
          <>
            <ImageField label="Image URL" value={page.image} onChange={(value) => updatePage("image", value)} />
            <RichEditor label="Side Title" value={page.sideTitle} onChange={(value) => updatePage("sideTitle", value)} />
            <Textarea label="Checklist (one per line)" value={lines(page.checklist)} onChange={(value) => updatePage("checklist", splitLines(value))} />
            <Field label="Start Online Label" value={page.startOnlineLabel} onChange={(value) => updatePage("startOnlineLabel", value)} />
            <Field label="Start Online URL" value={page.startOnlineHref} onChange={(value) => updatePage("startOnlineHref", value)} />
            <Field label="Contact Label" value={page.contactLabel} onChange={(value) => updatePage("contactLabel", value)} />
            <Field label="Contact URL" value={page.contactHref} onChange={(value) => updatePage("contactHref", value)} />
            <RichEditor label="Form Title" value={page.formTitle} onChange={(value) => updatePage("formTitle", value)} />
            <Field label="Submit Label" value={page.submitLabel} onChange={(value) => updatePage("submitLabel", value)} />
            <Field label="Success Text" value={page.successText} onChange={(value) => updatePage("successText", value)} />
            <Field label="Error Text" value={page.errorText} onChange={(value) => updatePage("errorText", value)} />
          </>
        ) : null}

        {active === "contact" ? (
          <>
            <ImageField label="Image URL" value={page.image} onChange={(value) => updatePage("image", value)} />
            <RichEditor label="Form Title" value={page.formTitle} onChange={(value) => updatePage("formTitle", value)} />
            <RichEditor label="Form Copy" value={page.formCopy} onChange={(value) => updatePage("formCopy", value)} />
            <EditableList
              title="Contact Links"
              items={page.links || []}
              fields={["icon", "title", "href", "text"]}
              onUpdate={(index, field, value) => updatePageList("links", index, field, value)}
              onAdd={() => addPageListItem("links", { icon: "lock", title: "New Link", href: "/", text: "Link text" })}
              onRemove={(index) => removePageListItem("links", index)}
            />
          </>
        ) : null}

        {active === "team" ? (
          <>
            <RichEditor label="CEO Eyebrow" value={page.ceoEyebrow} onChange={(value) => updatePage("ceoEyebrow", value)} />
            <RichEditor label="CEO Name" value={page.ceoName} onChange={(value) => updatePage("ceoName", value)} />
            <RichEditor label="CEO Role" value={page.ceoRole} onChange={(value) => updatePage("ceoRole", value)} />
            <ImageField label="CEO Image URL" value={page.ceoImage} onChange={(value) => updatePage("ceoImage", value)} />
            <RichEditor label="CEO Bio" value={page.ceoBio} onChange={(value) => updatePage("ceoBio", value)} />
            <RichEditor label="History Eyebrow" value={page.historyEyebrow} onChange={(value) => updatePage("historyEyebrow", value)} />
            <RichEditor label="History Title" value={page.historyTitle} onChange={(value) => updatePage("historyTitle", value)} />
            <RichEditor label="History Copy" value={page.historyCopy} onChange={(value) => updatePage("historyCopy", value)} />
            <EditableList
              title="History Timeline"
              items={page.history || []}
              fields={["year", "title", "copy"]}
              multilineFields={["copy"]}
              onUpdate={(index, field, value) => updatePageList("history", index, field, value)}
              onAdd={() => addPageListItem("history", { year: "Year", title: "Milestone", copy: "Milestone copy" })}
              onRemove={(index) => removePageListItem("history", index)}
            />
            <EditableList
              title="Team Members"
              items={page.members || []}
              fields={["name", "designation", "branch", "image", "enabled"]}
              onUpdate={(index, field, value) => updatePageList("members", index, field, value)}
              onAdd={() => addPageListItem("members", { name: "New Team Member", designation: "Designation", branch: "", image: "", enabled: true })}
              onRemove={(index) => removePageListItem("members", index)}
            />
          </>
        ) : null}

        {active === "careers" ? (
          <>
            <ImageField label="Image URL" value={page.image} onChange={(value) => updatePage("image", value)} />
            <RichEditor label="Intro Eyebrow" value={page.introEyebrow} onChange={(value) => updatePage("introEyebrow", value)} />
            <RichEditor label="Intro Title" value={page.introTitle} onChange={(value) => updatePage("introTitle", value)} />
            <RichEditor label="Intro Copy" value={page.introCopy} onChange={(value) => updatePage("introCopy", value)} />
            <RichEditor label="Openings Eyebrow" value={page.openingsEyebrow} onChange={(value) => updatePage("openingsEyebrow", value)} />
            <RichEditor label="Openings Title" value={page.openingsTitle} onChange={(value) => updatePage("openingsTitle", value)} />
            <RichEditor label="Openings Button Text" value={page.openingsButtonText} onChange={(value) => updatePage("openingsButtonText", value)} />
            <RichEditor label="Openings Button URL" value={page.openingsButtonHref} onChange={(value) => updatePage("openingsButtonHref", value)} />
            <RichEditor label="Process Eyebrow" value={page.processEyebrow} onChange={(value) => updatePage("processEyebrow", value)} />
            <RichEditor label="Process Title" value={page.processTitle} onChange={(value) => updatePage("processTitle", value)} />
            <RichEditor label="Process Copy" value={page.processCopy} onChange={(value) => updatePage("processCopy", value)} />
            <EditableList
              title="Career Values"
              items={page.values || []}
              fields={["icon", "title", "copy", "enabled"]}
              multilineFields={["copy"]}
              onUpdate={(index, field, value) => updatePageList("values", index, field, value)}
              onAdd={() => addPageListItem("values", { icon: "filing", title: "New value", copy: "Value copy", enabled: true })}
              onRemove={(index) => removePageListItem("values", index)}
            />
            <EditableList
              title="Career Openings"
              items={page.openings || []}
              fields={["icon", "title", "type", "location", "summary", "enabled"]}
              multilineFields={["summary"]}
              onUpdate={(index, field, value) => updatePageList("openings", index, field, value)}
              onAdd={() => addPageListItem("openings", { icon: "business", title: "New role", type: "Full time", location: "Office", summary: "Role summary", enabled: true })}
              onRemove={(index) => removePageListItem("openings", index)}
            />
            <StringListEditor
              title="Application Steps"
              items={page.steps || []}
              onUpdate={(items) => updatePage("steps", items)}
            />
          </>
        ) : null}

        {active === "serviceDetail" ? (
          <>
            <RichEditor label="Fallback Eyebrow" value={page.eyebrowFallback} onChange={(value) => updatePage("eyebrowFallback", value)} />
            <RichEditor label="Overview Title" value={page.overviewTitle} onChange={(value) => updatePage("overviewTitle", value)} />
            <RichEditor label="Overview Copy" value={page.overviewCopy} onChange={(value) => updatePage("overviewCopy", value)} />
            <RichEditor label="Process Title" value={page.processTitle} onChange={(value) => updatePage("processTitle", value)} />
            <StringListEditor title="Process Steps" items={page.processSteps || []} onUpdate={(items) => updatePage("processSteps", items)} />
            <RichEditor label="Requirements Title" value={page.requirementsTitle} onChange={(value) => updatePage("requirementsTitle", value)} />
            <RichEditor label="Empty Requirements Text" value={page.emptyRequirementsText} onChange={(value) => updatePage("emptyRequirementsText", value)} />
            <div className="rounded-2xl border border-primary/10 p-4">
              <h3 className="mb-4 text-lg font-bold text-primary">Benefits Section</h3>
              <div className="grid gap-4">
                <Field label="Benefits Eyebrow" value={page.benefitsEyebrow} onChange={(value) => updatePage("benefitsEyebrow", value)} />
                <RichEditor label="Benefits Title" value={page.benefitsTitle} onChange={(value) => updatePage("benefitsTitle", value)} />
                <RichEditor label="Benefits Copy" value={page.benefitsCopy} onChange={(value) => updatePage("benefitsCopy", value)} />
              </div>
            </div>
            <div className="rounded-2xl border border-primary/10 p-4">
              <h3 className="mb-4 text-lg font-bold text-primary">Eligibility Section</h3>
              <div className="grid gap-4">
                <Field label="Eligibility Eyebrow" value={page.eligibilityEyebrow} onChange={(value) => updatePage("eligibilityEyebrow", value)} />
                <RichEditor label="Eligibility Title" value={page.eligibilityTitle} onChange={(value) => updatePage("eligibilityTitle", value)} />
                <RichEditor label="Eligibility Copy" value={page.eligibilityCopy} onChange={(value) => updatePage("eligibilityCopy", value)} />
              </div>
            </div>
            <Field label="Fee Label" value={page.feeLabel} onChange={(value) => updatePage("feeLabel", value)} />
            <Field label="Timeline Label" value={page.timelineLabel} onChange={(value) => updatePage("timelineLabel", value)} />
            <RichEditor label="Fee Note" value={page.feeNote} onChange={(value) => updatePage("feeNote", value)} />
            <Field label="Start Online Label" value={page.startOnlineLabel} onChange={(value) => updatePage("startOnlineLabel", value)} />
            <Field label="Start Online URL" value={page.startOnlineHref} onChange={(value) => updatePage("startOnlineHref", value)} />
            <Field label="Appointment Label" value={page.appointmentLabel} onChange={(value) => updatePage("appointmentLabel", value)} />
            <Field label="Appointment URL" value={page.appointmentHref} onChange={(value) => updatePage("appointmentHref", value)} />
            <Field label="Call Label" value={page.callLabel} onChange={(value) => updatePage("callLabel", value)} />
            <Field label="Call URL" value={page.callHref} onChange={(value) => updatePage("callHref", value)} />
            <Field label="WhatsApp Label" value={page.whatsappLabel} onChange={(value) => updatePage("whatsappLabel", value)} />
            <Field label="WhatsApp Phone" value={page.whatsappPhone} onChange={(value) => updatePage("whatsappPhone", value)} />
            <div className="rounded-2xl border border-primary/10 p-4">
              <h3 className="mb-4 text-lg font-bold text-primary">FAQ Section</h3>
              <div className="grid gap-4">
                <RichEditor label="FAQ Eyebrow" value={page.faqEyebrow} onChange={(value) => updatePage("faqEyebrow", value)} />
                <RichEditor label="FAQ Title" value={page.faqTitle} onChange={(value) => updatePage("faqTitle", value)} />
                <RichEditor label="FAQ Copy" value={page.faqCopy} onChange={(value) => updatePage("faqCopy", value)} />
                <EditableList
                  title="Fallback FAQ Items"
                  items={page.faqItems || []}
                  fields={["question", "answer", "enabled"]}
                  richFields={["answer"]}
                  onUpdate={(index, field, value) => updatePageList("faqItems", index, field, value)}
                  onAdd={() => addPageListItem("faqItems", { question: "New question", answer: "New answer", enabled: true })}
                  onRemove={(index) => removePageListItem("faqItems", index)}
                />
              </div>
            </div>
            <RichEditor label="Long Description Title" value={page.longDescriptionTitle} onChange={(value) => updatePage("longDescriptionTitle", value)} />
            <RichEditor label="Long Description" value={page.longDescription} onChange={(value) => updatePage("longDescription", value)} />
            <RichEditor label="Related Eyebrow" value={page.relatedEyebrow} onChange={(value) => updatePage("relatedEyebrow", value)} />
            <RichEditor label="Related Title" value={page.relatedTitle} onChange={(value) => updatePage("relatedTitle", value)} />
            <RichEditor label="Other Services Carousel Title" value={page.otherServicesTitle} onChange={(value) => updatePage("otherServicesTitle", value)} />
            <Field label="All Services Label" value={page.allServicesLabel} onChange={(value) => updatePage("allServicesLabel", value)} />
          </>
        ) : null}

        {active === "calculators" ? (
          <>
            <RichEditor label="Disclaimer" value={page.disclaimer} onChange={(value) => updatePage("disclaimer", value)} />
            <RichEditor label="Salary Title" value={page.salaryTitle} onChange={(value) => updatePage("salaryTitle", value)} />
            <RichEditor label="Salary Copy" value={page.salaryCopy} onChange={(value) => updatePage("salaryCopy", value)} />
            <RichEditor label="Business Title" value={page.businessTitle} onChange={(value) => updatePage("businessTitle", value)} />
            <RichEditor label="Business Copy" value={page.businessCopy} onChange={(value) => updatePage("businessCopy", value)} />
            <Field label="Consultation Button Label" value={page.consultationLabel} onChange={(value) => updatePage("consultationLabel", value)} />
            <Field label="Consultation Button URL" value={page.consultationHref} onChange={(value) => updatePage("consultationHref", value)} />
            <div className="rounded-2xl border border-primary/10 p-4">
              <h3 className="mb-4 text-lg font-bold text-primary">FAQ Section</h3>
              <div className="grid gap-4">
                <Field label="FAQ Eyebrow" value={page.faqEyebrow} onChange={(value) => updatePage("faqEyebrow", value)} />
                <RichEditor label="FAQ Title" value={page.faqTitle} onChange={(value) => updatePage("faqTitle", value)} />
                <EditableList
                  title="FAQ Items"
                  items={page.faqItems || []}
                  fields={["icon", "question", "answer", "enabled"]}
                  multilineFields={["answer"]}
                  onUpdate={(index, field, value) => updatePageList("faqItems", index, field, value)}
                  onAdd={() => addPageListItem("faqItems", { icon: "faq", question: "New question", answer: "New answer", enabled: true })}
                  onRemove={(index) => removePageListItem("faqItems", index)}
                />
              </div>
            </div>
          </>
        ) : null}

        {active === "faqs" ? (
          <>
            <RichEditor label="Sidebar Title" value={page.sideTitle} onChange={(value) => updatePage("sideTitle", value)} />
            <RichEditor label="Sidebar Copy" value={page.sideCopy} onChange={(value) => updatePage("sideCopy", value)} />
            <Field label="Sidebar Phone" value={page.sidePhone} onChange={(value) => updatePage("sidePhone", value)} />
            <Field label="Sidebar Email" value={page.sideEmail} onChange={(value) => updatePage("sideEmail", value)} />
            <EditableList
              title="FAQ Items"
              items={page.items || []}
              fields={["icon", "question", "answer"]}
              multilineFields={["answer"]}
              onUpdate={(index, field, value) => updatePageList("items", index, field, value)}
              onAdd={() => addPageListItem("items", { icon: "faq", question: "New question", answer: "New answer" })}
              onRemove={(index) => removePageListItem("items", index)}
            />
          </>
        ) : null}

        {active === "branchDetail" ? (
          <>
            <RichEditor label="Details Eyebrow" value={page.detailsEyebrow} onChange={(value) => updatePage("detailsEyebrow", value)} />
            <RichEditor label="Details Title" value={page.detailsTitle} onChange={(value) => updatePage("detailsTitle", value)} />
            <RichEditor label="Details Copy" value={page.detailsCopy} onChange={(value) => updatePage("detailsCopy", value)} />
            <RichEditor label="Support Title" value={page.supportTitle} onChange={(value) => updatePage("supportTitle", value)} />
            <RichEditor label="Support Copy" value={page.supportCopy} onChange={(value) => updatePage("supportCopy", value)} />
            <Field label="Appointment Label" value={page.appointmentLabel} onChange={(value) => updatePage("appointmentLabel", value)} />
            <Field label="Consultation Label" value={page.consultationLabel} onChange={(value) => updatePage("consultationLabel", value)} />
            <Field label="Map Label" value={page.mapLabel} onChange={(value) => updatePage("mapLabel", value)} />
          </>
        ) : null}

        {active === "serviceAreaDetail" ? (
          <>
            <Field label="Coverage Title" value={page.coverageTitle} onChange={(value) => updatePage("coverageTitle", value)} />
            <RichEditor label="Coverage Fallback" value={page.coverageFallback} onChange={(value) => updatePage("coverageFallback", value)} />
            <Field label="Related Title" value={page.relatedTitle} onChange={(value) => updatePage("relatedTitle", value)} />
            <Field label="Appointment Label" value={page.appointmentLabel} onChange={(value) => updatePage("appointmentLabel", value)} />
            <Field label="Appointment URL" value={page.appointmentHref} onChange={(value) => updatePage("appointmentHref", value)} />
            <Field label="All Areas Label" value={page.allAreasLabel} onChange={(value) => updatePage("allAreasLabel", value)} />
          </>
        ) : null}

        {["privacyPolicy", "refundPolicy", "termsAndConditions"].includes(active) ? (
          <EditableList
            title="Policy Sections"
            items={page.sections || []}
            fields={["icon", "title", "copy"]}
            multilineFields={["copy"]}
            onUpdate={(index, field, value) => updatePageList("sections", index, field, value)}
            onAdd={() => addPageListItem("sections", { icon: "filing", title: "New Section", copy: "Section content" })}
            onRemove={(index) => removePageListItem("sections", index)}
          />
        ) : null}

        {active === "branches" ? (
          <EditableList
            title="Branches"
            items={data.branches || []}
            fields={["name", "slug", "phone", "email", "address", "googleMapUrl", "image"]}
            multilineFields={["address"]}
            onUpdate={(index, field, value) => updateCollection("branches", index, field, value)}
            onAdd={() => addCollectionItem("branches", { name: "New Branch", slug: "new-branch", phone: "", email: "", address: "", googleMapUrl: "", image: "" })}
            onRemove={(index) => removeCollectionItem("branches", index)}
          />
        ) : null}

        {active === "serviceAreas" ? (
          <EditableList
            title="City Service Areas"
            items={data.serviceAreas || []}
            fields={["title", "slug", "province", "icon", "image", "summary", "coverage", "relatedCategories", "enabled"]}
            multilineFields={["summary", "coverage", "relatedCategories"]}
            onUpdate={(index, field, value) => updateCollection("serviceAreas", index, field, field === "relatedCategories" ? splitLines(value) : value)}
            onAdd={() => addCollectionItem("serviceAreas", { title: "New City", slug: "new-city", province: "Punjab", icon: "landmark", image: "", summary: "", coverage: "", relatedCategories: [], enabled: true })}
            onRemove={(index) => removeCollectionItem("serviceAreas", index)}
          />
        ) : null}
      </div>
    </Editor>
  );
}

function SeoEditor({ data, updateData, save }) {
  if (!data) return null;
  const seoPages = { ...defaultSeoPages, ...(data.seoPages || {}) };
  const [active, setActive] = useState(Object.keys(seoPages)[0]);
  const page = seoPages[active] || defaultSeoPages.home;

  function updatePage(field, value) {
    updateData("seoPages", {
      ...seoPages,
      [active]: {
        ...page,
        [field]: value
      }
    });
  }

  return (
    <Editor title="SEO Meta Tags" onSave={() => save()}>
      <div className="mb-5 flex flex-wrap gap-2">
        {Object.entries(seoPages).map(([key, item]) => (
          <button className={`rounded-full px-4 py-2 text-sm font-black ${key === active ? "bg-primary text-white" : "bg-paper text-primary"}`} onClick={() => setActive(key)} key={key}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        <Field label="Page" value={`${page.label} (${page.path})`} onChange={() => { }} disabled />
        <Field label="Meta Title" value={page.metaTitle} onChange={(value) => updatePage("metaTitle", value)} />
        <Textarea label="Meta Description" value={page.metaDescription} onChange={(value) => updatePage("metaDescription", value)} />
      </div>
    </Editor>
  );
}

function EditableList({ title, items, fields, multilineFields = [], richFields = [], onUpdate, onAdd, onRemove }) {
  const [openItems, setOpenItems] = useState({});

  function toggleItem(index) {
    setOpenItems((current) => ({ ...current, [index]: !current[index] }));
  }

  return (
    <div className="rounded-2xl border border-primary/10 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-primary">{title}</h2>
        <button type="button" className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-primary" onClick={onAdd}>Add</button>
      </div>
      <div className="grid gap-4">
        {items.map((item, index) => (
          <div className="rounded-2xl bg-paper p-3" key={`${title}-${index}`}>
            <button className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left font-black text-primary" type="button" onClick={() => toggleItem(index)}>
              <span className="min-w-0">
                <span className="block truncate">{item.title || item.name || item.question || item.label || `${title} ${index + 1}`}</span>
                <span className="mt-1 block truncate text-xs font-bold text-muted">{item.slug || item.designation || item.role || item.href || item.copy || ""}</span>
              </span>
              <span className="text-xl">{openItems[index] ? "-" : "+"}</span>
            </button>
            {openItems[index] ? (
              <div className="mt-3 grid gap-3">
                {fields.map((field) =>
                  field === "enabled" ? (
                    <Toggle key={field} label={fieldLabel(field)} checked={item[field] !== false} onChange={(value) => onUpdate(index, field, value)} />
                  ) : field === "icon" ? (
                    <IconField key={field} label={fieldLabel(field)} value={item[field]} onChange={(value) => onUpdate(index, field, value)} />
                  ) : field.toLowerCase().includes("image") ? (
                    <ImageField key={field} label={fieldLabel(field)} value={item[field]} onChange={(value) => onUpdate(index, field, value)} />
                  ) : richFields.includes(field) ? (
                    <RichEditor key={field} label={fieldLabel(field)} value={item[field]} onChange={(value) => onUpdate(index, field, value)} />
                  ) : multilineFields.includes(field) ? (
                    <Textarea key={field} label={fieldLabel(field)} value={lines(item[field])} placeholder={fieldPlaceholder(field)} onChange={(value) => onUpdate(index, field, value)} />
                  ) : (
                    <Field key={field} label={fieldLabel(field)} value={item[field]} onChange={(value) => onUpdate(index, field, value)} />
                  )
                )}
                <button type="button" className="w-fit rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-700" onClick={() => {
                  onRemove(index);
                  notifyAdminToast(`${title} item deleted. Save changes to apply.`);
                }}>
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSlidesEditor({ slides, onUpdate, onAdd, onRemove, onUpdateBlock, onAddBlock, onRemoveBlock }) {
  const [openItems, setOpenItems] = useState({});

  function toggleItem(index) {
    setOpenItems((current) => ({ ...current, [index]: !current[index] }));
  }

  return (
    <div className="rounded-2xl border border-primary/10 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-primary">Hero Slider</h2>
        <button type="button" className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-primary" onClick={onAdd}>Add Slide</button>
      </div>
      <div className="grid gap-4">
        {(slides || []).map((slide, index) => (
          <div className="rounded-2xl bg-paper p-3" key={`hero-slide-${index}`}>
            <button className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left font-black text-primary" type="button" onClick={() => toggleItem(index)}>
              <span className="min-w-0">
                <span className="block truncate">{slide.title || `Hero Slide ${index + 1}`}</span>
                <span className="mt-1 block truncate text-xs font-bold text-muted">{slide.eyebrow || slide.copy || ""}</span>
              </span>
              <span className="text-xl">{openItems[index] ? "-" : "+"}</span>
            </button>
            {openItems[index] ? (
              <div className="mt-3 grid gap-4">
                <Toggle label="Enabled" checked={slide.enabled !== false} onChange={(value) => onUpdate(index, "enabled", value)} />
                <RichEditor label="Eyebrow" value={slide.eyebrow || ""} onChange={(value) => onUpdate(index, "eyebrow", value)} />
                <RichEditor label="Title" value={slide.title || ""} onChange={(value) => onUpdate(index, "title", value)} />
                <RichEditor label="Copy" value={slide.copy || ""} onChange={(value) => onUpdate(index, "copy", value)} />
                <ImageField label="Image URL" value={slide.image || ""} onChange={(value) => onUpdate(index, "image", value)} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Primary Button Label" value={slide.primaryLabel || ""} onChange={(value) => onUpdate(index, "primaryLabel", value)} />
                  <Field label="Primary Button URL" value={slide.primaryHref || ""} onChange={(value) => onUpdate(index, "primaryHref", value)} />
                  <Field label="Secondary Button Label" value={slide.secondaryLabel || ""} onChange={(value) => onUpdate(index, "secondaryLabel", value)} />
                  <Field label="Secondary Button URL" value={slide.secondaryHref || ""} onChange={(value) => onUpdate(index, "secondaryHref", value)} />
                </div>
                <HeroSlideBlocks
                  blocks={slide.blocks || []}
                  slideIndex={index}
                  onUpdateBlock={onUpdateBlock}
                  onAddBlock={onAddBlock}
                  onRemoveBlock={onRemoveBlock}
                />
                <button type="button" className="w-fit rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-700" onClick={() => {
                  onRemove(index);
                  notifyAdminToast("Hero slide deleted. Save changes to apply.");
                }}>
                  Delete Slide
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSlideBlocks({ blocks, slideIndex, onUpdateBlock, onAddBlock, onRemoveBlock }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-black text-primary">Slide Feature Blocks</h3>
        <button type="button" className="rounded-full bg-primary px-4 py-2 text-xs font-black text-white" onClick={() => onAddBlock(slideIndex)}>Add Block</button>
      </div>
      <div className="grid gap-3">
        {blocks.map((block, blockIndex) => (
          <div className="grid gap-3 rounded-2xl bg-paper p-3" key={`hero-slide-${slideIndex}-block-${blockIndex}`}>
            <Toggle label="Enabled" checked={block.enabled !== false} onChange={(value) => onUpdateBlock(slideIndex, blockIndex, "enabled", value)} />
            <div className="grid gap-3 md:grid-cols-3">
              <IconField label="Icon" value={block.icon || "scale"} onChange={(value) => onUpdateBlock(slideIndex, blockIndex, "icon", value)} />
              <Field label="Label" value={block.label || ""} onChange={(value) => onUpdateBlock(slideIndex, blockIndex, "label", value)} />
              <Field label="Value" value={block.value || ""} onChange={(value) => onUpdateBlock(slideIndex, blockIndex, "value", value)} />
            </div>
            <button type="button" className="w-fit rounded-full border border-red-200 px-4 py-2 text-xs font-black text-red-700" onClick={() => {
              onRemoveBlock(slideIndex, blockIndex);
              notifyAdminToast("Hero block deleted. Save changes to apply.");
            }}>
              Delete Block
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StringListEditor({ title, items, onUpdate, maxItems = Infinity, addLabel = "Add", placeholder = "", richItems = false }) {
  const [openItems, setOpenItems] = useState({});
  const canAdd = (items || []).length < maxItems;

  function updateItem(index, value) {
    onUpdate(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  return (
    <div className="rounded-2xl border border-primary/10 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-primary">{title}</h2>
        {canAdd ? (
          <button type="button" className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-primary" onClick={() => onUpdate([...(items || []), ""])}>
            {addLabel}
          </button>
        ) : (
          <span className="rounded-full bg-paper px-4 py-2 text-sm font-black text-primary/60">Limit {maxItems}</span>
        )}
      </div>
      <div className="grid gap-3">
        {(items || []).map((item, index) => (
          <div className="rounded-2xl bg-paper p-3" key={`${title}-${index}`}>
            <button className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left font-black text-primary" type="button" onClick={() => setOpenItems((current) => ({ ...current, [index]: !current[index] }))}>
              <span className="truncate">{item || `Item ${index + 1}`}</span>
              <span className="text-xl">{openItems[index] ? "-" : "+"}</span>
            </button>
            {openItems[index] ? (
              <div className="mt-3 grid gap-2">
                {richItems ? (
                  <RichEditor label={`Item ${index + 1}`} value={item} placeholder={placeholder} onChange={(value) => updateItem(index, value)} />
                ) : (
                  <Textarea label={`Item ${index + 1}`} value={item} placeholder={placeholder} onChange={(value) => updateItem(index, value)} />
                )}
                <button type="button" className="w-fit rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-700" onClick={() => {
                  onUpdate(items.filter((_, itemIndex) => itemIndex !== index));
                  notifyAdminToast(`${title} item deleted. Save changes to apply.`);
                }}>
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceList({ data, save }) {
  if (!data || !data.services) return null;
  function remove(id) {
    save({ ...data, services: data.services.filter((item) => item.id !== id && item.slug !== id) }, "Service deleted.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-black text-primary">All Services</h1>
        <Link className="rounded-full bg-primary px-5 py-3 text-sm font-black text-white" href="/admin/services/new">Create Service</Link>
      </div>
      <div className="mt-6 grid gap-3">
        {data.services.map((service) => (
          <div className="grid gap-3 rounded-2xl border border-primary/10 p-4 md:grid-cols-[1fr_auto]" key={service.id}>
            <div>
              <p className="text-xs font-black uppercase text-primary/60">{service.category}</p>
              <h2 className="text-xl font-black text-primary">{service.title}</h2>
              <p className="mt-1 break-all text-xs font-bold text-primary/50">/services/{service.slug}</p>
              <p className="text-sm text-muted">{service.summary}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link className="rounded-full border border-primary/15 px-4 py-2 text-sm font-black text-primary" href={`/services/${service.slug}`} target="_blank">View</Link>
              <Link className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-primary" href={`/admin/services/new?id=${service.id}`}>Edit</Link>
              <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-700" onClick={() => remove(service.id)}>Delete</button>
            </div>
          </div>
        ))}
        {data.services.length === 0 ? <p className="rounded-lg bg-paper p-5 font-bold text-muted">No services yet.</p> : null}
      </div>
    </div>
  );
}

function AdminFrame({ children, status, toast, onLogout }) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(`${window.location.pathname}${window.location.search}`);
  }, []);

  return (
    <section className="min-h-screen bg-paper py-8">
      <div className="mx-auto grid w-[min(1280px,calc(100%-32px))] gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-primary/10 bg-white p-4 shadow-xl shadow-primary/5 lg:sticky lg:top-6">
          <Link className="mb-4 flex flex-col items-center gap-3 rounded-2xl bg-paper p-3 font-black text-primary" href="/admin">
            <img className="" src="/images/zumar-law-firm-logo.webp" alt="Zumar Law Firm" />
            Admin Panel
          </Link>
          <nav className="grid gap-1 text-sm font-black text-ink/75">
            {navItems.map(([label, href, icon]) => (
              <Link className={`flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-secondary hover:text-primary ${isActiveAdminLink(currentUrl, href) ? "bg-primary text-white hover:bg-primary hover:text-white" : ""}`} href={href} key={`${label}-${href}`}>
                <FaIcon className="size-3.5" name={icon} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 border-t border-primary/10 pt-4">
            <p className="mb-2 px-3 text-xs font-black uppercase text-primary/55">Editable Pages</p>
            <nav className="grid gap-1 text-sm font-black text-ink/75">
              {pageSidebarItems.map(([label, href, icon]) => (
                <Link className={`flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-secondary hover:text-primary ${isActiveAdminLink(currentUrl, href) ? "bg-secondary text-primary" : ""}`} href={href} key={`${label}-${href}`}>
                  <FaIcon className="size-3.5" name={icon} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          {onLogout ? (
            <button onClick={onLogout} className="mt-5 w-full rounded-full border border-primary/15 px-4 py-2 text-sm font-black text-primary">
              Logout
            </button>
          ) : null}
        </aside>
        <main className="min-h-[620px] rounded-lg border border-primary/10 bg-white p-5 shadow-xl shadow-primary/5 sm:p-7">
          {status ? <p className="mb-4 rounded-2xl bg-secondary px-4 py-3 text-sm font-black text-primary">{status}</p> : null}
          {children}
        </main>
      </div>
      {toast ? (
        <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl px-5 py-4 text-sm font-black text-white shadow-2xl shadow-primary/20 ${toast.type === "error" ? "bg-red-700" : "bg-primary"}`} role="status">
          {toast.message}
        </div>
      ) : null}
    </section>
  );
}

function Dashboard({ data }) {
  if (!data || !data.services) {
    return null;
  }

  const stats = [
    ["Services", data.services.length],
    ["Blogs", data.blogs.length],
    ["News", data.news.length],
    ["Appointments", data.appointments.length]
  ];
  const shortcuts = [
    ["Edit Home", "/admin/home", "building"],
    ["Edit Pages", "/admin/pages?page=services", "filing"],
    ["New Service", "/admin/services/new", "registration"],
    ["SEO", "/admin/seo", "search"],
    ["Settings", "/admin/settings", "lock"],
    ["Open Website", "/", "globe"]
  ];

  return (
    <div>
      <div className="rounded-lg bg-gradient-to-br from-primary to-[#4b1933] p-7 text-white">
        <p className="text-sm font-black uppercase text-secondary">Zumar CMS</p>
        <h1 className="mt-2 text-4xl font-black">Admin Dashboard</h1>
        <p className="mt-3 max-w-2xl leading-7 text-white/75">Manage public pages, service records, SEO, calculators, social links, appointments, and uploadable images from one panel.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div className="rounded-lg border border-primary/10 bg-paper p-5" key={label}>
            <strong className="block text-4xl font-black text-primary">{value}</strong>
            <span className="text-sm font-bold text-muted">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map(([label, href, icon]) => (
          <Link className="flex items-center gap-3 rounded-lg border border-primary/10 bg-white p-4 font-black text-primary shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:bg-secondary" href={href} key={href}>
            <span className="grid size-10 place-items-center rounded-md bg-primary text-white">
              <FaIcon className="size-4" name={icon} />
            </span>
            {label}
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-primary/10 p-5">
        <h2 className="text-2xl font-black text-primary">Recent Appointments</h2>
        <Rows items={data.appointments.slice(0, 5)} columns={["name", "phone", "service", "status"]} />
      </div>
    </div>
  );
}

function SettingsEditor({ data, updateData, save }) {
  if (!data) return null;
  const settings = data.settings || {};
  const socialLinks = settings.socialLinks || [];
  const googleSiteVerifications = normalizeStringList(settings.googleSiteVerifications).slice(0, 3);

  function updateSettings(field, value) {
    updateData("settings", { ...settings, [field]: value });
  }

  function updateSocial(index, field, value) {
    updateSettings(
      "socialLinks",
      socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function addSocial() {
    updateSettings("socialLinks", [...socialLinks, { label: "New Social", href: "", enabled: true }]);
  }

  function removeSocial(index) {
    updateSettings(
      "socialLinks",
      socialLinks.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  return (
    <Editor title="Site Settings" onSave={() => save()}>
      <div className="grid gap-4">
        <Field label="Admin Email" value={settings.adminEmail} onChange={(value) => updateSettings("adminEmail", value)} />
        <Field label="Admin Password" type="password" value={settings.adminPassword} autoComplete="new-password" onChange={(value) => updateSettings("adminPassword", value)} />
        <StringListEditor
          title="Google Site Verification Tags"
          items={googleSiteVerifications}
          maxItems={3}
          addLabel="Add Verification"
          placeholder={`Paste the verification code or full meta tag, for example:\n<meta name="google-site-verification" content="P7eQOJbCElXiZJRUTwP9L-0_8IWA17poAURJNjFlo2w" />`}
          onUpdate={(items) => updateSettings("googleSiteVerifications", normalizeStringList(items).slice(0, 3))}
        />
        <StringListEditor
          title="Service Categories"
          items={data.categories || []}
          onUpdate={(items) => updateData("categories", items)}
        />
        <EditableList
          title="Social Media Links"
          items={socialLinks}
          fields={["label", "href", "enabled"]}
          onUpdate={updateSocial}
          onAdd={addSocial}
          onRemove={removeSocial}
        />
      </div>
    </Editor>
  );
}

function HomeEditor({ data, updateData, save }) {
  if (!data || !data.homeSections || data.homeSections.length === 0) return null;
  const [active, setActive] = useState(data.homeSections[0]?.id);
  const section = data.homeSections.find((item) => item.id === active) || data.homeSections[0];
  const heroSlides = data.heroSlides || [];
  const homeStats = data.homeStats || [];
  const homeContent = data.homeContent || {};

  function updateSection(field, value) {
    updateData(
      "homeSections",
      data.homeSections.map((item) => (item.id === section.id ? { ...item, [field]: value } : item))
    );
  }

  function updateHeroSlide(index, field, value) {
    updateData(
      "heroSlides",
      heroSlides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, [field]: value } : slide))
    );
  }

  function addHeroSlide() {
    updateData("heroSlides", [
      ...heroSlides,
      {
        eyebrow: "New slide",
        title: "New hero slide title",
        copy: "Add the slide description from the admin panel.",
        image: "",
        blocks: [
          { icon: "scale", label: "Block 1", value: "Block 1 description", enabled: true },
          { icon: "filing", label: "Block 2", value: "Block 2 description", enabled: true },
          { icon: "building", label: "Block 3", value: "Block 3 description", enabled: true }
        ],
        primaryLabel: "Explore Services",
        primaryHref: "/services",
        secondaryLabel: "Contact",
        secondaryHref: "/contact",
        enabled: true
      }
    ]);
  }

  function removeHeroSlide(index) {
    updateData(
      "heroSlides",
      heroSlides.filter((_, slideIndex) => slideIndex !== index)
    );
  }

  function updateHeroSlideBlock(slideIndex, blockIndex, field, value) {
    updateData(
      "heroSlides",
      heroSlides.map((slide, currentSlideIndex) => {
        if (currentSlideIndex !== slideIndex) return slide;
        const blocks = (slide.blocks || []).map((block, currentBlockIndex) =>
          currentBlockIndex === blockIndex ? { ...block, [field]: value } : block
        );
        return { ...slide, blocks };
      })
    );
  }

  function addHeroSlideBlock(slideIndex) {
    updateData(
      "heroSlides",
      heroSlides.map((slide, currentSlideIndex) => {
        if (currentSlideIndex !== slideIndex) return slide;
        return {
          ...slide,
          blocks: [
            ...(slide.blocks || []),
            { icon: "scale", label: "New Block", value: "Block description", enabled: true }
          ]
        };
      })
    );
  }

  function removeHeroSlideBlock(slideIndex, blockIndex) {
    updateData(
      "heroSlides",
      heroSlides.map((slide, currentSlideIndex) => {
        if (currentSlideIndex !== slideIndex) return slide;
        return {
          ...slide,
          blocks: (slide.blocks || []).filter((_, currentBlockIndex) => currentBlockIndex !== blockIndex)
        };
      })
    );
  }

  function updateHomeStat(index, field, value) {
    updateData(
      "homeStats",
      homeStats.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function addHomeStat() {
    updateData("homeStats", [
      ...homeStats,
      {
        icon: "scale",
        value: "100 +",
        label: "New Stat",
        enabled: true
      }
    ]);
  }

  function removeHomeStat(index) {
    updateData(
      "homeStats",
      homeStats.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateHomeBlock(block, field, value) {
    updateData("homeContent", {
      ...homeContent,
      [block]: { ...(homeContent[block] || {}), [field]: value }
    });
  }

  function updateSharedProcess(field, value) {
    const sharedProcess = homeContent.sharedProcess || {};
    updateData("homeContent", {
      ...homeContent,
      sharedProcess: { ...sharedProcess, [field]: value },
      ...(field === "steps" ? { processSteps: value } : {})
    });
  }

  function updateSharedProcessStep(index, field, value) {
    const sharedProcess = homeContent.sharedProcess || {};
    const steps = (sharedProcess.steps || homeContent.processSteps || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item));
    updateSharedProcess("steps", steps);
  }

  function addSharedProcessStep() {
    const sharedProcess = homeContent.sharedProcess || {};
    updateSharedProcess("steps", [
      ...(sharedProcess.steps || homeContent.processSteps || []),
      { number: "05", title: "New step", copy: "Step details", enabled: true }
    ]);
  }

  function removeSharedProcessStep(index) {
    const sharedProcess = homeContent.sharedProcess || {};
    updateSharedProcess("steps", (sharedProcess.steps || homeContent.processSteps || []).filter((_, itemIndex) => itemIndex !== index));
  }

  function updateWhyChooseList(listKey, index, field, value) {
    const whyChoose = homeContent.whyChoose || {};
    updateData("homeContent", {
      ...homeContent,
      whyChoose: {
        ...whyChoose,
        [listKey]: (whyChoose[listKey] || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
      }
    });
  }

  function addWhyChooseListItem(listKey, item) {
    const whyChoose = homeContent.whyChoose || {};
    updateData("homeContent", {
      ...homeContent,
      whyChoose: {
        ...whyChoose,
        [listKey]: [...(whyChoose[listKey] || []), item]
      }
    });
  }

  function removeWhyChooseListItem(listKey, index) {
    const whyChoose = homeContent.whyChoose || {};
    updateData("homeContent", {
      ...homeContent,
      whyChoose: {
        ...whyChoose,
        [listKey]: (whyChoose[listKey] || []).filter((_, itemIndex) => itemIndex !== index)
      }
    });
  }

  function updateTestimonialsList(index, field, value) {
    const testimonials = homeContent.testimonials || {};
    updateData("homeContent", {
      ...homeContent,
      testimonials: {
        ...testimonials,
        items: (testimonials.items || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
      }
    });
  }

  function addTestimonial() {
    const testimonials = homeContent.testimonials || {};
    updateData("homeContent", {
      ...homeContent,
      testimonials: {
        ...testimonials,
        items: [
          ...(testimonials.items || []),
          {
            icon: "tax",
            name: "Client Name",
            role: "Service Client",
            quote: "Add client testimonial text here.",
            rating: "5",
            enabled: true
          }
        ]
      }
    });
  }

  function removeTestimonial(index) {
    const testimonials = homeContent.testimonials || {};
    updateData("homeContent", {
      ...homeContent,
      testimonials: {
        ...testimonials,
        items: (testimonials.items || []).filter((_, itemIndex) => itemIndex !== index)
      }
    });
  }

  function updateHomeFaqItem(index, field, value) {
    const faq = homeContent.faq || {};
    updateData("homeContent", {
      ...homeContent,
      faq: {
        ...faq,
        items: (faq.items || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
      }
    });
  }

  function addHomeFaqItem() {
    const faq = homeContent.faq || {};
    updateData("homeContent", {
      ...homeContent,
      faq: {
        ...faq,
        items: [
          ...(faq.items || []),
          {
            icon: "faq",
            question: "New homepage FAQ question",
            answer: "Add a clear answer for Zumar Law Firm clients.",
            enabled: true
          }
        ]
      }
    });
  }

  function removeHomeFaqItem(index) {
    const faq = homeContent.faq || {};
    updateData("homeContent", {
      ...homeContent,
      faq: {
        ...faq,
        items: (faq.items || []).filter((_, itemIndex) => itemIndex !== index)
      }
    });
  }

  function updateYoutubeVideo(index, field, value) {
    const youtubeVideos = homeContent.youtubeVideos || {};
    updateData("homeContent", {
      ...homeContent,
      youtubeVideos: {
        ...youtubeVideos,
        items: (youtubeVideos.items || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
      }
    });
  }

  function addYoutubeVideo() {
    const youtubeVideos = homeContent.youtubeVideos || {};
    updateData("homeContent", {
      ...homeContent,
      youtubeVideos: {
        ...youtubeVideos,
        items: [
          ...(youtubeVideos.items || []),
          {
            title: "New YouTube Video",
            embedUrl: "Z4d5k5MxK9k?si=B_SZaJFCpzWH_ioD",
            enabled: true
          }
        ]
      }
    });
  }

  function removeYoutubeVideo(index) {
    const youtubeVideos = homeContent.youtubeVideos || {};
    updateData("homeContent", {
      ...homeContent,
      youtubeVideos: {
        ...youtubeVideos,
        items: (youtubeVideos.items || []).filter((_, itemIndex) => itemIndex !== index)
      }
    });
  }

  function updateServiceSelection(field, slugs) {
    updateData("homeContent", {
      ...homeContent,
      serviceSelections: {
        ...(homeContent.serviceSelections || {}),
        [field]: slugs
      }
    });
  }

  return (
    <Editor title="Home Page Sections" onSave={() => save()}>
      <HeroSlidesEditor
        slides={heroSlides}
        onUpdate={updateHeroSlide}
        onAdd={addHeroSlide}
        onRemove={removeHeroSlide}
        onUpdateBlock={updateHeroSlideBlock}
        onAddBlock={addHeroSlideBlock}
        onRemoveBlock={removeHeroSlideBlock}
      />
      <div className="my-7 border-t border-primary/10" />
      <EditableList
        title="Hero Bottom Stats"
        items={homeStats}
        fields={["icon", "value", "label", "enabled"]}
        onUpdate={updateHomeStat}
        onAdd={addHomeStat}
        onRemove={removeHomeStat}
      />
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="Why Choose Us"
        block={homeContent.whyChoose || {}}
        fields={["eyebrow", "title", "copy", "image", "panelTitle", "primaryLabel", "primaryHref", "secondaryLabel", "secondaryHref", "enabled"]}
        multilineFields={["copy"]}
        onUpdate={(field, value) => updateHomeBlock("whyChoose", field, value)}
      />
      <div className="mt-4 grid gap-4">
        <EditableList
          title="Why Choose Strength Bars"
          items={homeContent.whyChoose?.strengths || []}
          fields={["label", "value", "enabled"]}
          onUpdate={(index, field, value) => updateWhyChooseList("strengths", index, field, value)}
          onAdd={() => addWhyChooseListItem("strengths", { label: "New strength", value: "80%", enabled: true })}
          onRemove={(index) => removeWhyChooseListItem("strengths", index)}
        />
        <EditableList
          title="Why Choose Benefits"
          items={homeContent.whyChoose?.benefits || []}
          fields={["icon", "text", "enabled"]}
          onUpdate={(index, field, value) => updateWhyChooseList("benefits", index, field, value)}
          onAdd={() => addWhyChooseListItem("benefits", { icon: "check", text: "New benefit", enabled: true })}
          onRemove={(index) => removeWhyChooseListItem("benefits", index)}
        />
      </div>
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="Shared How We Work Section"
        block={homeContent.sharedProcess || {}}
        fields={["eyebrow", "title", "copy", "image", "enabled"]}
        multilineFields={["copy"]}
        onUpdate={updateSharedProcess}
      />
      <EditableList
        title="Shared How We Work Steps"
        items={homeContent.sharedProcess?.steps || homeContent.processSteps || []}
        fields={["number", "title", "copy", "enabled"]}
        multilineFields={["copy"]}
        onUpdate={updateSharedProcessStep}
        onAdd={addSharedProcessStep}
        onRemove={removeSharedProcessStep}
      />
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="Service Areas Preview"
        block={homeContent.serviceAreas || {}}
        fields={["eyebrow", "title", "buttonText", "buttonHref", "limit", "enabled"]}
        onUpdate={(field, value) => updateHomeBlock("serviceAreas", field, value)}
      />
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="Testimonials Section"
        block={homeContent.testimonials || {}}
        fields={["eyebrow", "title", "copy", "enabled"]}
        multilineFields={["copy"]}
        onUpdate={(field, value) => updateHomeBlock("testimonials", field, value)}
      />
      <div className="mt-4">
        <EditableList
          title="Testimonials"
          items={homeContent.testimonials?.items || []}
          fields={["icon", "name", "role", "quote", "rating", "enabled"]}
          multilineFields={["quote"]}
          onUpdate={updateTestimonialsList}
          onAdd={addTestimonial}
          onRemove={removeTestimonial}
        />
      </div>
      <div className="my-7 border-t border-primary/10" />
      <ServiceSelectionEditor
        title="Featured Carousel Services"
        description="Choose services for the home featured carousel. If none are selected, all visible services are used."
        services={data.services || []}
        selectedSlugs={homeContent.serviceSelections?.featuredSlugs || []}
        onUpdate={(slugs) => updateServiceSelection("featuredSlugs", slugs)}
      />
      <div className="my-7 border-t border-primary/10" />
      <ServiceSelectionEditor
        title="Home Services Grid"
        description="Choose services for the home services grid. If none are selected, all visible services are used before the grid limit is applied."
        services={data.services || []}
        selectedSlugs={homeContent.serviceSelections?.homeGridSlugs || []}
        onUpdate={(slugs) => updateServiceSelection("homeGridSlugs", slugs)}
      />
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="News & Blog Preview"
        block={homeContent.updates || {}}
        fields={["newsEyebrow", "newsTitle", "newsButtonText", "newsButtonHref", "blogEyebrow", "blogTitle", "blogButtonText", "blogButtonHref", "enabled"]}
        onUpdate={(field, value) => updateHomeBlock("updates", field, value)}
      />
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="Branches Preview"
        block={homeContent.branches || {}}
        fields={["eyebrow", "title", "buttonText", "buttonHref", "limit", "enabled"]}
        onUpdate={(field, value) => updateHomeBlock("branches", field, value)}
      />
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="Homepage FAQ Section"
        block={homeContent.faq || {}}
        fields={["eyebrow", "title", "copy", "enabled"]}
        multilineFields={["copy"]}
        onUpdate={(field, value) => updateHomeBlock("faq", field, value)}
      />
      <div className="mt-4">
        <EditableList
          title="Homepage FAQ Items"
          items={homeContent.faq?.items || []}
          fields={["icon", "question", "answer", "enabled"]}
          multilineFields={["answer"]}
          onUpdate={updateHomeFaqItem}
          onAdd={addHomeFaqItem}
          onRemove={removeHomeFaqItem}
        />
      </div>
      <div className="my-7 border-t border-primary/10" />
      <HomeBlockEditor
        title="YouTube Video Carousel"
        block={homeContent.youtubeVideos || {}}
        fields={["eyebrow", "title", "copy", "channelLabel", "channelHref", "enabled"]}
        multilineFields={["copy"]}
        onUpdate={(field, value) => updateHomeBlock("youtubeVideos", field, value)}
      />
      <div className="mt-4">
        <EditableList
          title="YouTube Videos"
          items={homeContent.youtubeVideos?.items || []}
          fields={["title", "embedUrl", "enabled"]}
          onUpdate={updateYoutubeVideo}
          onAdd={addYoutubeVideo}
          onRemove={removeYoutubeVideo}
        />
      </div>
      <div className="my-7 border-t border-primary/10" />
      <div className="mb-5 flex flex-wrap gap-2">
        {data.homeSections.map((item) => (
          <button className={`rounded-full px-4 py-2 text-sm font-black ${item.id === active ? "bg-primary text-white" : "bg-paper text-primary"}`} onClick={() => setActive(item.id)} key={item.id}>
            {item.tab}
          </button>
        ))}
      </div>
      {section ? (
        <div className="grid gap-4">
          <Field label="Tab Label" value={section.tab} onChange={(value) => updateSection("tab", value)} />
          <RichEditor label="Eyebrow" value={section.eyebrow} onChange={(value) => updateSection("eyebrow", value)} />
          <RichEditor label="Title" value={section.title} onChange={(value) => updateSection("title", value)} />
          <RichEditor label="Content" value={section.copy} onChange={(value) => updateSection("copy", value)} />
          <Field label="Image URL" value={section.image || ""} onChange={(value) => updateSection("image", value)} />
          <Toggle label="Visible" checked={section.enabled !== false} onChange={(value) => updateSection("enabled", value)} />
        </div>
      ) : null}
    </Editor>
  );
}

function HomeBlockEditor({ title, block, fields, multilineFields = [], onUpdate }) {
  return (
    <div className="rounded-2xl border border-primary/10 p-4">
      <h2 className="mb-4 text-2xl font-black text-primary">{title}</h2>
      <div className="grid gap-4">
        {fields.map((field) =>
          field === "enabled" ? (
            <Toggle key={field} label={fieldLabel(field)} checked={block[field] !== false} onChange={(value) => onUpdate(field, value)} />
          ) : field === "icon" ? (
            <IconField key={field} label={fieldLabel(field)} value={block[field]} onChange={(value) => onUpdate(field, value)} />
          ) : field.toLowerCase().includes("image") ? (
            <ImageField key={field} label={fieldLabel(field)} value={block[field]} onChange={(value) => onUpdate(field, value)} />
          ) : multilineFields.includes(field) ? (
            <Textarea key={field} label={fieldLabel(field)} value={block[field]} onChange={(value) => onUpdate(field, value)} />
          ) : (
            <Field key={field} label={fieldLabel(field)} value={block[field]} onChange={(value) => onUpdate(field, value)} />
          )
        )}
      </div>
    </div>
  );
}

function ServiceSelectionEditor({ title, description, services, selectedSlugs, onUpdate }) {
  const selected = new Set(normalizeSelectionInput(selectedSlugs));
  const visibleServices = (services || []).filter((service) => service.enabled !== false);

  function toggle(slug) {
    const next = new Set(selected);

    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }

    onUpdate(visibleServices.filter((service) => next.has(service.slug)).map((service) => service.slug));
  }

  return (
    <div className="rounded-2xl border border-primary/10 p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-primary">{title}</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-muted">{description}</p>
          <p className="mt-2 text-xs font-black uppercase text-primary/50">{selected.size} selected</p>
        </div>
        <button className="rounded-full border border-primary/15 px-4 py-2 text-sm font-black text-primary" type="button" onClick={() => onUpdate([])}>
          Use All
        </button>
      </div>
      <div className="grid max-h-[460px] gap-2 overflow-y-auto rounded-2xl bg-paper p-3 md:grid-cols-2">
        {visibleServices.map((service) => (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 text-sm font-bold text-ink shadow-sm shadow-primary/5" key={service.slug}>
            <input className="mt-1" type="checkbox" checked={selected.has(service.slug)} onChange={() => toggle(service.slug)} />
            <span>
              <span className="block font-black text-primary">{service.title}</span>
              <span className="mt-1 block text-xs font-bold uppercase text-primary/50">{service.category} | {service.slug}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AboutEditor({ data, updateData, save }) {
  if (!data || !data.about) return null;
  const about = data.about;

  function updateAbout(field, value) {
    updateData("about", { ...about, [field]: value });
  }

  function updateList(listKey, index, field, value) {
    updateAbout(
      listKey,
      (about[listKey] || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function addListItem(listKey, item) {
    updateAbout(listKey, [...(about[listKey] || []), item]);
  }

  function removeListItem(listKey, index) {
    updateAbout(
      listKey,
      (about[listKey] || []).filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateTeamPreview(field, value) {
    updateAbout("teamPreview", { ...(about.teamPreview || {}), [field]: value });
  }

  function updateCertifications(field, value) {
    updateAbout("certifications", { ...(about.certifications || {}), [field]: value });
  }

  function updateCertificationItem(index, field, value) {
    const items = about.certifications?.items || [];
    updateCertifications(
      "items",
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function addCertificationItem() {
    const items = about.certifications?.items || [];
    updateCertifications("items", [
      ...items,
      { icon: "certificate", title: "New Certificate", number: "Available on request", issuer: "Authority", image: "", enabled: true }
    ]);
  }

  function removeCertificationItem(index) {
    const items = about.certifications?.items || [];
    updateCertifications(
      "items",
      items.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  return (
    <Editor title="About Page Content" onSave={() => save()}>
      <div className="grid gap-4">
        <RichEditor label="Eyebrow" value={about.eyebrow} onChange={(value) => updateAbout("eyebrow", value)} />
        <RichEditor label="Title" value={about.title} onChange={(value) => updateAbout("title", value)} />
        <RichEditor label="Header Copy" value={about.copy} onChange={(value) => updateAbout("copy", value)} />
        <ImageField label="Image URL" value={about.image} onChange={(value) => updateAbout("image", value)} />

        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Introduction Section</h2>
          <div className="grid gap-4">
            <RichEditor label="Intro Eyebrow" value={about.introEyebrow} onChange={(value) => updateAbout("introEyebrow", value)} />
            <RichEditor label="Intro Title" value={about.introTitle} onChange={(value) => updateAbout("introTitle", value)} />
            <RichEditor label="Intro Copy" value={about.introCopy} onChange={(value) => updateAbout("introCopy", value)} />
            <RichEditor label="Intro Second Copy" value={about.introSecondCopy} onChange={(value) => updateAbout("introSecondCopy", value)} />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Company Overview</h2>
          <div className="grid gap-4">
            <Field label="Overview Eyebrow" value={about.overviewEyebrow} onChange={(value) => updateAbout("overviewEyebrow", value)} />
            <RichEditor label="Overview Title" value={about.overviewTitle} onChange={(value) => updateAbout("overviewTitle", value)} />
            <RichEditor label="Overview Copy" value={about.overviewCopy} onChange={(value) => updateAbout("overviewCopy", value)} />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Company History</h2>
          <div className="grid gap-4">
            <Field label="History Eyebrow" value={about.historyEyebrow} onChange={(value) => updateAbout("historyEyebrow", value)} />
            <RichEditor label="History Title" value={about.historyTitle} onChange={(value) => updateAbout("historyTitle", value)} />
            <Field label="Establishment Year" value={about.establishmentYear} onChange={(value) => updateAbout("establishmentYear", value)} />
            <RichEditor label="History Copy" value={about.historyCopy} onChange={(value) => updateAbout("historyCopy", value)} />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Milestones</h2>
          <EditableList
            title="Major Milestones"
            items={about.milestones || []}
            fields={["year", "title", "copy", "enabled"]}
            multilineFields={["copy"]}
            onUpdate={(index, field, value) => updateList("milestones", index, field, value)}
            onAdd={() => addListItem("milestones", { year: "Year", title: "Milestone", copy: "Milestone description", enabled: true })}
            onRemove={(index) => removeListItem("milestones", index)}
          />
        </div>

        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Mission & Vision</h2>
          <div className="grid gap-4">
            <RichEditor label="Mission Title" value={about.missionTitle} onChange={(value) => updateAbout("missionTitle", value)} />
            <RichEditor label="Mission Copy" value={about.missionCopy} onChange={(value) => updateAbout("missionCopy", value)} />
            <RichEditor label="Vision Title" value={about.visionTitle} onChange={(value) => updateAbout("visionTitle", value)} />
            <RichEditor label="Vision Copy" value={about.visionCopy} onChange={(value) => updateAbout("visionCopy", value)} />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Core Values</h2>
          <EditableList
            title="Core Values"
            items={about.coreValues || []}
            fields={["icon", "title", "copy", "enabled"]}
            multilineFields={["copy"]}
            onUpdate={(index, field, value) => updateList("coreValues", index, field, value)}
            onAdd={() => addListItem("coreValues", { icon: "shield", title: "New Value", copy: "Value description", enabled: true })}
            onRemove={(index) => removeListItem("coreValues", index)}
          />
        </div>

        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Registrations & Certifications</h2>
          <div className="grid gap-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={about.certifications?.enabled !== false} onChange={(e) => updateCertifications("enabled", e.target.checked)} className="size-5 rounded border-primary" />
              <span className="font-bold text-primary">Enable Certifications Section</span>
            </label>
            <Field label="Certifications Eyebrow" value={about.certifications?.eyebrow} onChange={(value) => updateCertifications("eyebrow", value)} />
            <RichEditor label="Certifications Title" value={about.certifications?.title} onChange={(value) => updateCertifications("title", value)} />
            <RichEditor label="Certifications Copy" value={about.certifications?.copy} onChange={(value) => updateCertifications("copy", value)} />

            <div className="border-t border-primary/10 pt-4">
              <h3 className="mb-3 text-lg font-bold text-primary">Certificate Items</h3>
              {(about.certifications?.items || []).map((item, index) => (
                <div key={index} className="mb-4 rounded-lg border border-primary/5 bg-paper p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold text-primary">Certificate {index + 1}</span>
                    <button
                      type="button"
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-black text-red-700"
                      onClick={() => removeCertificationItem(index)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <IconField
                      label="Icon"
                      value={item.icon}
                      onChange={(value) => updateCertificationItem(index, "icon", value)}
                    />
                    <Field label="Certificate Title" value={item.title} onChange={(value) => updateCertificationItem(index, "title", value)} />
                    <Field label="Certificate Number" value={item.number} onChange={(value) => updateCertificationItem(index, "number", value)} />
                    <Field label="Issuing Authority" value={item.issuer} onChange={(value) => updateCertificationItem(index, "issuer", value)} />
                    <ImageField label="Certificate Image URL" value={item.image} onChange={(value) => updateCertificationItem(index, "image", value)} />
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={item.enabled !== false} onChange={(e) => updateCertificationItem(index, "enabled", e.target.checked)} className="size-5 rounded border-primary" />
                      <span className="font-bold text-primary">Show this certificate</span>
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="w-full rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary"
                onClick={addCertificationItem}
              >
                + Add Certificate
              </button>
            </div>
          </div>
        </div>

        <EditableList
          title="Stats"
          items={about.stats || []}
          fields={["icon", "value", "label"]}
          onUpdate={(index, field, value) => updateList("stats", index, field, value)}
          onAdd={() => addListItem("stats", { icon: "scale", value: "0", label: "New stat" })}
          onRemove={(index) => removeListItem("stats", index)}
        />
        <EditableList
          title="Highlight Blocks"
          items={about.highlights || []}
          fields={["icon", "title", "copy"]}
          multilineFields={["copy"]}
          onUpdate={(index, field, value) => updateList("highlights", index, field, value)}
          onAdd={() => addListItem("highlights", { icon: "filing", title: "New Highlight", copy: "Highlight copy" })}
          onRemove={(index) => removeListItem("highlights", index)}
        />
        <p className="rounded-lg bg-paper p-4 text-sm font-bold leading-6 text-muted">
          The How We Work section is shared with the Home page. Edit it once from Home Page Sections, then it updates on both Home and About.
        </p>
        <div className="rounded-2xl border border-primary/10 p-4">
          <h2 className="mb-4 text-2xl font-black text-primary">Team Preview Block</h2>
          <div className="grid gap-4">
            <RichEditor label="Eyebrow" value={about.teamPreview?.eyebrow} onChange={(value) => updateTeamPreview("eyebrow", value)} />
            <RichEditor label="Title" value={about.teamPreview?.title} onChange={(value) => updateTeamPreview("title", value)} />
            <RichEditor label="Copy" value={about.teamPreview?.copy} onChange={(value) => updateTeamPreview("copy", value)} />
            <Field label="Button Text" value={about.teamPreview?.buttonText} onChange={(value) => updateTeamPreview("buttonText", value)} />
            <Field label="Button URL" value={about.teamPreview?.buttonHref} onChange={(value) => updateTeamPreview("buttonHref", value)} />
          </div>
        </div>
      </div>
    </Editor>
  );
}

function ServiceForm({ data, id, save }) {
  if (!data || !data.services) return null;
  const router = useRouter();
  const current = data.services.find((item) => item.id === id || item.slug === id);
  const [form, setForm] = useState(current || emptyService);
  const isEditing = Boolean(current);

  function submit(event) {
    event.preventDefault();
    const slug = uniqueSlug(makeSlug(form.slug || form.title), data.services, current?.id || form.id);
    const record = {
      ...form,
      id: slug,
      slug,
      requirements: splitLines(form.requirements),
      benefits: splitLines(form.benefits),
      eligibility: splitLines(form.eligibility),
      processSteps: splitLines(form.processSteps),
      relatedServiceSlugs: normalizeServiceSlugs(form.relatedServiceSlugs, data.services, slug),
      carouselServiceSlugs: normalizeServiceSlugs(form.carouselServiceSlugs, data.services, slug)
    };
    const next = upsertRecord(data.services, record, current, id);
    save({ ...data, services: next }, isEditing ? "Service updated." : "Service created.", true).then(() => router.push("/admin/services"));
  }

  return (
    <FormShell title={current ? "Edit Service" : "Create Service"} onSubmit={submit}>
      <ServiceFields data={data} form={form} setForm={setForm} />
    </FormShell>
  );
}

function ArticleList({ data, save }) {
  if (!data) return null;
  const type = "blogs";
  const rows = data[type];
  const base = "/admin/blogs/new";
  const publicBase = "/blog";

  function remove(id) {
    save({ ...data, [type]: rows.filter((item) => item.id !== id && item.slug !== id) }, "Blog deleted.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-black text-primary">All Blogs</h1>
        <Link className="rounded-full bg-primary px-5 py-3 text-sm font-black text-white" href={base}>Create New</Link>
      </div>
      <div className="mt-6 grid gap-3">
        {rows.map((item) => (
          <div className="grid gap-3 rounded-2xl border border-primary/10 p-4 md:grid-cols-[1fr_auto]" key={item.id}>
            <div>
              <p className="text-xs font-black uppercase text-primary/60">{item.date}</p>
              <h2 className="text-xl font-black text-primary">{item.title}</h2>
              <p className="mt-1 break-all text-xs font-bold text-primary/50">{publicBase}/{item.slug}</p>
              <p className="text-sm text-muted">{item.summary}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link className="rounded-full border border-primary/15 px-4 py-2 text-sm font-black text-primary" href={`${publicBase}/${item.slug}`} target="_blank">View</Link>
              <Link className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-primary" href={`${base}?id=${item.id}`}>Edit</Link>
              <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-700" onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 ? <p className="rounded-lg bg-paper p-5 font-bold text-muted">No records yet.</p> : null}
      </div>
    </div>
  );
}

function ArticleForm({ data, id, save }) {
  if (!data) return null;
  const router = useRouter();
  const type = "blogs";
  const current = data[type].find((item) => item.id === id || item.slug === id);
  const [form, setForm] = useState(current || emptyArticle);
  const label = "Blog";
  const isEditing = Boolean(current);

  function submit(event) {
    event.preventDefault();
    const slug = uniqueSlug(makeSlug(form.slug || form.title), data[type], current?.id || form.id);
    const record = { ...form, id: slug, slug, type: "blog" };
    const next = upsertRecord(data[type], record, current, id);
    save({ ...data, [type]: next }, `${label} ${isEditing ? "updated" : "created"}.`, true).then(() => router.push("/admin/blogs"));
  }

  return (
    <FormShell title={current ? `Edit ${label}` : `Create ${label}`} onSubmit={submit}>
      <ArticleFields form={form} setForm={setForm} isNews={false} />
    </FormShell>
  );
}

function Appointments({ data, save }) {
  if (!data || !data.appointments) return null;
  function updateStatus(id, status) {
    save({ ...data, appointments: data.appointments.map((item) => (item.id === id ? { ...item, status } : item)) }, "Appointment updated.");
  }

  function remove(id) {
    save({ ...data, appointments: data.appointments.filter((item) => item.id !== id) }, "Appointment deleted.");
  }

  return (
    <div>
      <h1 className="text-4xl font-black text-primary">All Appointments</h1>
      <div className="mt-6 grid gap-3">
        {data.appointments.map((item) => (
          <div className="rounded-2xl border border-primary/10 p-4" key={item.id}>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-xl font-black text-primary">{item.name}</h2>
                <p className="text-sm text-muted">{item.phone} | {item.email}</p>
                <p className="mt-2 font-bold text-ink">{item.service} {item.branch ? `| ${item.branch}` : ""} {item.date ? `| ${item.date}` : ""}</p>
                {item.details && Object.keys(item.details).length ? (
                  <dl className="mt-3 grid gap-2 rounded-xl bg-paper p-3 text-sm">
                    {Object.entries(item.details).map(([key, value]) => (
                      <div className="grid gap-1 sm:grid-cols-[180px_1fr]" key={key}>
                        <dt className="font-black text-primary">{labelFromKey(key)}</dt>
                        <dd className="font-semibold text-muted">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <p className="mt-2 text-sm leading-6 text-muted">{item.message}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <select className="rounded-full border border-primary/10 px-4 py-2 text-sm font-black text-primary" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-700" onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {data.appointments.length === 0 ? <p className="rounded-2xl bg-paper p-5 font-bold text-muted">No appointments yet.</p> : null}
      </div>
    </div>
  );
}

function labelFromKey(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ServiceFields({ data, form, setForm }) {
  return (
    <>
      <RichEditor label="Title" value={form.title} onChange={(value) => setForm(updateTitleAndMaybeSlug(form, value))} />
      <SlugField label="Slug" value={form.slug} prefix="/services/" onChange={(value) => setForm({ ...form, slug: makeSlug(value) })} onGenerate={() => setForm({ ...form, slug: makeSlug(form.title) })} />
      <Select label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} options={data.categories} />
      <IconField label="Icon" value={form.icon} onChange={(value) => setForm({ ...form, icon: value })} />
      <ImageField label="Image URL" value={form.image} onChange={(value) => setForm({ ...form, image: value })} />
      <Field label="Service Type" value={form.serviceType} onChange={(value) => setForm({ ...form, serviceType: value })} />
      <Field label="Price" value={String(form.price || "")} onChange={(value) => setForm({ ...form, price: value })} />
      <Field label="Timeline" value={form.timeline || ""} onChange={(value) => setForm({ ...form, timeline: value })} />
      <RichEditor label="Summary" value={form.summary} onChange={(value) => setForm({ ...form, summary: value })} />
      <div className="rounded-xl border border-primary/10 bg-paper p-5">
        <h3 className="mb-4 text-lg font-black text-primary">Service Detail Overview</h3>
        <div className="grid gap-4">
          <RichEditor label="Overview Title" value={form.overviewTitle || ""} onChange={(value) => setForm({ ...form, overviewTitle: value })} />
          <RichEditor label="Overview Copy" value={form.overviewCopy || ""} onChange={(value) => setForm({ ...form, overviewCopy: value })} />
        </div>
      </div>
      <StringListEditor
        title="How This Service Is Handled"
        items={ensureArray(form.processSteps)}
        onUpdate={(items) => setForm({ ...form, processSteps: items })}
        addLabel="Add Step"
        richItems
      />
      <RichEditor label="Service Handle / Process Title" value={form.processTitle || ""} onChange={(value) => setForm({ ...form, processTitle: value })} />
      <ServiceSelectionEditor
        title="Manual Related Services"
        description="Choose services shown under the right-side CTA buttons. If none are selected, related services are chosen automatically."
        services={(data.services || []).filter((service) => service.slug !== form.slug)}
        selectedSlugs={form.relatedServiceSlugs || []}
        onUpdate={(slugs) => setForm({ ...form, relatedServiceSlugs: slugs })}
      />
      <ServiceSelectionEditor
        title="Manual Carousel Services"
        description="Choose services shown in the bottom carousel. If none are selected, other visible services are shown automatically."
        services={(data.services || []).filter((service) => service.slug !== form.slug)}
        selectedSlugs={form.carouselServiceSlugs || []}
        onUpdate={(slugs) => setForm({ ...form, carouselServiceSlugs: slugs })}
      />
      <StringListEditor
        title="Requirements / Documents"
        items={ensureArray(form.requirements)}
        onUpdate={(items) => setForm({ ...form, requirements: items })}
        addLabel="Add Requirement"
        richItems
      />
      <StringListEditor
        title="Benefits"
        items={ensureArray(form.benefits)}
        onUpdate={(items) => setForm({ ...form, benefits: items })}
        addLabel="Add Benefit"
        richItems
      />
      <StringListEditor
        title="Eligibility"
        items={ensureArray(form.eligibility)}
        onUpdate={(items) => setForm({ ...form, eligibility: items })}
        addLabel="Add Eligibility"
        richItems
      />
      <div className="rounded-xl border border-primary/10 bg-paper p-5">
        <h3 className="mb-4 text-lg font-black text-primary">Service FAQs</h3>
        {(form.faqItems || []).map((item, index) => (
          <div key={index} className="mb-4 rounded-lg border border-primary/10 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <strong className="text-primary">FAQ #{index + 1}</strong>
              <button
                type="button"
                onClick={() => setForm({ ...form, faqItems: form.faqItems.filter((_, i) => i !== index) })}
                className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 transition hover:bg-red-100"
              >
                Delete
              </button>
            </div>
            <div className="grid gap-3">
              <Textarea
                label="Question"
                value={item.question || ""}
                onChange={(value) => {
                  const updated = [...(form.faqItems || [])];
                  updated[index] = { ...item, question: value };
                  setForm({ ...form, faqItems: updated });
                }}
                placeholder="e.g., How long does this service take?"
              />
              <RichEditor
                label="Answer"
                value={item.answer || ""}
                onChange={(value) => {
                  const updated = [...(form.faqItems || [])];
                  updated[index] = { ...item, answer: value };
                  setForm({ ...form, faqItems: updated });
                }}
                placeholder="e.g., Timeline depends on authority processing..."
              />
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.enabled !== false}
                  onChange={(e) => {
                    const updated = [...(form.faqItems || [])];
                    updated[index] = { ...item, enabled: e.target.checked };
                    setForm({ ...form, faqItems: updated });
                  }}
                  className="size-5 rounded border-primary"
                />
                <span className="font-bold text-primary">Enabled</span>
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, faqItems: [...(form.faqItems || []), { question: "", answer: "", enabled: true }] })}
          className="mt-3 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-white transition hover:bg-primary/90"
        >
          + Add FAQ
        </button>
      </div>
      <Field label="Meta Title" value={form.metaTitle} onChange={(value) => setForm({ ...form, metaTitle: value })} />
      <Textarea label="Meta Description" value={form.metaDescription} onChange={(value) => setForm({ ...form, metaDescription: value })} />
      <Toggle label="Visible" checked={form.enabled !== false} onChange={(value) => setForm({ ...form, enabled: value })} />
    </>
  );
}

function ArticleFields({ form, setForm, isNews }) {
  return (
    <>
      <RichEditor label="Title" value={form.title} onChange={(value) => setForm(updateTitleAndMaybeSlug(form, value))} />
      <SlugField label="Slug" value={form.slug} prefix={isNews ? "/news/" : "/blog/"} onChange={(value) => setForm({ ...form, slug: makeSlug(value) })} onGenerate={() => setForm({ ...form, slug: makeSlug(form.title) })} />
      <Field label="Date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
      <ImageField label="Image URL" value={form.image} onChange={(value) => setForm({ ...form, image: value })} />
      <Field label={isNews ? "Authority" : "Service"} value={isNews ? form.authority : form.service} onChange={(value) => setForm({ ...form, [isNews ? "authority" : "service"]: value })} />
      <RichEditor label="Summary" value={form.summary} onChange={(value) => setForm({ ...form, summary: value })} />
      <Field label="Meta Title" value={form.metaTitle} onChange={(value) => setForm({ ...form, metaTitle: value })} />
      <Textarea label="Meta Description" value={form.metaDescription} onChange={(value) => setForm({ ...form, metaDescription: value })} />
      <RichEditor label="Body" value={form.body} onChange={(value) => setForm({ ...form, body: value })} />
      <Toggle label="Visible" checked={form.enabled !== false} onChange={(value) => setForm({ ...form, enabled: value })} />
    </>
  );
}

function Editor({ title, onSave, children }) {
  return (
    <div>
      <div className="sticky top-0 z-20 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-white/95 py-4 backdrop-blur">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary/50">Content Manager</p>
          <h1 className="text-3xl font-black text-primary sm:text-4xl">{title}</h1>
        </div>
        <button className="rounded-md bg-primary px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-primary/90" onClick={onSave}>Save Changes</button>
      </div>
      {children}
    </div>
  );
}

function FormShell({ title, onSubmit, children }) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-white/95 py-4 backdrop-blur">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary/50">Record Editor</p>
          <h1 className="text-3xl font-black text-primary sm:text-4xl">{title}</h1>
        </div>
        <button className="min-h-12 rounded-md bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-primary/90">Save</button>
      </div>
      {children}
    </form>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false, autoComplete }) {
  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <input className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10 disabled:bg-paper disabled:text-muted" type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} disabled={disabled} autoComplete={autoComplete} />
    </label>
  );
}

function SlugField({ label, value, prefix, onChange, onGenerate }) {
  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <div className="grid gap-2 md:grid-cols-[1fr_auto]">
        <input className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={value || ""} onChange={(event) => onChange(event.target.value)} />
        <button className="min-h-12 rounded-2xl bg-secondary px-4 text-sm font-black text-primary" type="button" onClick={onGenerate}>
          Generate From Title
        </button>
      </div>
      <span className="break-all text-xs font-bold text-muted">Public URL: {prefix}{value || "slug"}</span>
    </label>
  );
}

function IconField({ label, value, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
        <select className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={value || "scale"} onChange={(event) => onChange(event.target.value)}>
          {iconOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <span className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-paper px-4 text-sm font-black text-primary">
          <FaIcon className="size-4" name={value || "scale"} />
          {value || "scale"}
        </span>
      </div>
    </label>
  );
}

function ImageField({ label, value, onChange }) {
  const [uploadStatus, setUploadStatus] = useState("");

  async function uploadImage(file) {
    if (!file) {
      return;
    }

    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("zumar-admin-token") || ""}`
      },
      body: formData
    });

    const payload = await response.json();

    if (!response.ok) {
      setUploadStatus(payload.error || "Upload failed.");
      return;
    }

    onChange(payload.url);
    setUploadStatus("Uploaded.");
    setTimeout(() => setUploadStatus(""), 1800);
  }

  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <input className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={value || ""} onChange={(event) => onChange(event.target.value)} />
      <input className="rounded-2xl border border-dashed border-primary/20 bg-paper px-4 py-3 text-sm font-bold text-primary file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-black file:text-white" type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} />
      {uploadStatus ? <span className="text-xs font-black text-primary/70">{uploadStatus}</span> : null}
      {value ? (
        <img className="h-28 w-full max-w-sm rounded-2xl border border-primary/10 object-cover" src={value} alt={`${label} preview`} />
      ) : null}
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <textarea className="min-h-28 rounded-2xl border border-primary/10 px-4 py-3 font-semibold text-ink outline-none placeholder:text-muted/60 focus:ring-4 focus:ring-primary/10" value={value || ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function RichEditor({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <div className="rounded-2xl border border-primary/10 overflow-hidden">
        <RichTextEditor value={value || ""} onChange={onChange} placeholder={placeholder} />
      </div>
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <select className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={value || ""} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm font-black text-primary">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function Rows({ items, columns }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <tbody>
          {items.map((item) => (
            <tr className="border-t border-primary/10" key={item.id}>
              {columns.map((column) => <td className="py-3 pr-4" key={column}>{item[column] || "-"}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 ? <p className="py-4 text-sm font-bold text-muted">No records.</p> : null}
    </div>
  );
}

function lines(value) {
  return Array.isArray(value) ? value.join("\n") : value || "";
}

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value) {
  return Array.isArray(value)
    ? value
    : String(value || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
}

function normalizeServiceSlugs(value, services = [], currentSlug = "") {
  const allowed = new Set(
    (services || [])
      .filter((service) => service.enabled !== false && service.slug !== currentSlug)
      .map((service) => service.slug)
  );

  return normalizeSelectionInput(value).filter((slug, index, slugs) => allowed.has(slug) && slugs.indexOf(slug) === index);
}

function normalizeSelectionInput(value) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeSelectionInput(item));
  }

  if (value && typeof value === "object") {
    return normalizeSelectionInput(value.slug || value.id || value.title || value.value);
  }

  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function fieldLabel(value) {
  return String(value || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function fieldPlaceholder(field) {
  if (field === "relatedCategories") {
    return "Enter one service category per line, for example:\nNTN\nSales Tax\nIncome Tax\nCompany Reg";
  }

  return "";
}

function isActiveAdminLink(currentUrl, href) {
  if (href === "/admin") {
    return currentUrl === "/admin";
  }

  return currentUrl === href || currentUrl.startsWith(`${href}&`) || currentUrl.startsWith(`${href}?`);
}

function updateTitleAndMaybeSlug(form, title) {
  const previousTitleSlug = makeSlug(form.title || "");
  const shouldSyncSlug = !form.slug || form.slug === previousTitleSlug;

  return {
    ...form,
    title,
    ...(shouldSyncSlug ? { slug: makeSlug(title) } : {})
  };
}

function uniqueSlug(value, records, currentId) {
  const base = makeSlug(value || "item");
  const used = new Set(
    (records || [])
      .filter((item) => item.id !== currentId)
      .map((item) => item.slug)
      .filter(Boolean)
  );

  if (!used.has(base)) {
    return base;
  }

  let count = 2;
  let candidate = `${base}-${count}`;

  while (used.has(candidate)) {
    count += 1;
    candidate = `${base}-${count}`;
  }

  return candidate;
}

function upsertRecord(records, record, current, lookupId) {
  if (!current) {
    return [record, ...(records || [])];
  }

  let replaced = false;
  const next = [];

  for (const item of records || []) {
    if (matchesEditedRecord(item, record, current, lookupId)) {
      if (!replaced) {
        next.push(record);
        replaced = true;
      }
      continue;
    }

    next.push(item);
  }

  return replaced ? next : [record, ...next];
}

function matchesEditedRecord(item, record, current, lookupId) {
  const ids = new Set([current?.id, current?.slug, lookupId].filter(Boolean));
  const slugs = new Set([current?.slug, record?.slug, lookupId].filter(Boolean));

  return ids.has(item.id) || ids.has(item.slug) || slugs.has(item.slug);
}

function notifyAdminToast(message, type = "success") {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("zumar-admin-toast", { detail: { message, type } }));
}

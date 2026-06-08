import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyWhatsappButton from "@/components/StickyWhatsappButton";
import { readCmsData } from "@/lib/cmsStore";
import { Plus_Jakarta_Sans } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/schema";

export const revalidate = 60;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export async function generateMetadata() {
  const data = await readCmsData();
  const googleSiteVerifications = normalizeGoogleSiteVerifications(data.settings?.googleSiteVerifications);

  return {
    title: {
      default: "Zumar Law Firm | Tax, Corporate & Regulatory Services",
      template: "%s | Zumar Law Firm"
    },
    description:
      "Professional tax, company registration, intellectual property, licensing, and regulatory services in Pakistan.",
    metadataBase: new URL("https://zumarlawfirm.com"),
    alternates: {
      canonical: "https://zumarlawfirm.com"
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    openGraph: {
      type: "website",
      url: "https://zumarlawfirm.com",
      siteName: "Zumar Law Firm",
      title: "Zumar Law Firm | Tax, Corporate & Regulatory Services",
      description: "Professional tax, company registration, intellectual property, licensing, and regulatory services in Pakistan.",
      images: [
        {
          url: "/images/zumar-law-firm-logo.webp",
          width: 258,
          height: 160,
          alt: "Zumar Law Firm logo"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Zumar Law Firm | Tax, Corporate & Regulatory Services",
      description: "Professional tax, company registration, intellectual property, licensing, and regulatory services in Pakistan.",
      images: ["/images/zumar-law-firm-logo.webp"]
    },
    verification: googleSiteVerifications.length ? { google: googleSiteVerifications } : undefined,
    icons: {
      icon: "/images/favicon.ico",
      shortcut: "/images/favicon.ico",
      apple: "/images/favicon.ico"
    }
  };
}

function normalizeGoogleSiteVerifications(value) {
  return (Array.isArray(value) ? value : [value])
    .map((item) => extractGoogleSiteVerification(item))
    .filter(Boolean)
    .slice(0, 3);
}

function extractGoogleSiteVerification(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "";
  }

  return text.match(/content=["']([^"']+)["']/i)?.[1]?.trim() || text;
}

export default async function RootLayout({ children }) {
  await readCmsData();
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="font-sans text-ink antialiased" suppressHydrationWarning>
        <JsonLd schema={generateOrganizationSchema()} />
        <JsonLd schema={generateWebsiteSchema()} />
        <Header />
        <main>
          {children}
        </main>
        <StickyWhatsappButton />
        <Footer />
      </body>
    </html>
  );
}

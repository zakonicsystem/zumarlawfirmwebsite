import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MouseEffect from "@/components/MouseEffect";
import PageTransition from "@/components/PageTransition";
import StickyWhatsappButton from "@/components/StickyWhatsappButton";
import { readCmsData } from "@/lib/cmsStore";
import { Plus_Jakarta_Sans } from "next/font/google";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans text-ink antialiased">
        <MouseEffect />
        <Header />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <StickyWhatsappButton />
        <Footer />
      </body>
    </html>
  );
}

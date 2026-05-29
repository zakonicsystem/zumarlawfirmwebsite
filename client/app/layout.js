import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MouseEffect from "@/components/MouseEffect";
import PageTransition from "@/components/PageTransition";
import StickyWhatsappButton from "@/components/StickyWhatsappButton";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata = {
  title: {
    default: "Zumar Law Firm | Tax, Corporate & Regulatory Services",
    template: "%s | Zumar Law Firm"
  },
  description:
    "Professional tax, company registration, intellectual property, licensing, and regulatory services in Pakistan.",
  metadataBase: new URL("https://zumarlawfirm.com"),
  verification: {
    google: "P7eQOJbCElXiZJRUTwP9L-0_8IWA17poAURJNjFlo2w"
  },
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/favicon.ico"
  }
};

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

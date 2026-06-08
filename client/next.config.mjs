/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "zumarlawfirm.com"
      },
      {
        protocol: "https",
        hostname: "app.zumarlawfirm.com"
      }
    ]
  },
  async redirects() {
    return [
      // Image redirects (existing)
      { source: "/images/zumar-logo.webp", destination: "/images/zumar-law-firm-logo.webp", permanent: true },
      { source: "/images/Lahore%20Branch.webp", destination: "/images/zumar-law-firm-lahore-office.webp", permanent: true },
      { source: "/images/Islamabad%20Branch.webp", destination: "/images/zumar-law-firm-islamabad-office.webp", permanent: true },
      { source: "/images/Contact%20Page.webp", destination: "/images/zumar-law-firm-contact-support.webp", permanent: true },
      { source: "/images/CEO.webp", destination: "/images/zumar-law-firm-ceo-asif-arslan.webp", permanent: true },
      { source: "/images/Bushra.webp", destination: "/images/bushra-niazi-zumar-law-firm-islamabad.webp", permanent: true },
      { source: "/images/Asif.webp", destination: "/images/asif-arslan-zumar-law-firm-lahore.webp", permanent: true },
      { source: "/images/aqssa%20ahmed.webp", destination: "/images/aqssa-ahmed-zumar-law-firm-lahore.webp", permanent: true },
      { source: "/images/About.jpeg", destination: "/images/zumar-law-firm-about-pakistan.jpeg", permanent: true },
      { source: "/images/2nd%20slide.jpeg", destination: "/images/company-registration-services-pakistan.jpeg", permanent: true },
      { source: "/images/tax%20return.jpeg", destination: "/images/tax-filing-services-pakistan.jpeg", permanent: true },

      // Old blog/guide pages
      { source: "/dts-license-pakistan-registration-completeguide", destination: "/services/dts-license", permanent: true },
      { source: "/dts-license-kpk-dts-license-sindh-services", destination: "/services/dts-license", permanent: true },

      // Old tax calculator pages
      { source: "/salary-tax-calculator-pakistan", destination: "/calculators", permanent: true },
      { source: "/business-tax-calculator-pakistan", destination: "/calculators", permanent: true },
      { source: "/tax-calculator", destination: "/calculators", permanent: true },

      // Old misc pages
      { source: "/freelancer-registration-fee-zumar-law-firm", destination: "/services/freelancer-registration", permanent: true },
      { source: "/pseb-online-registration", destination: "/services/company-registration-pseb", permanent: true },
      { source: "/international-services", destination: "/services", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },

      // Old service pages - General
      { source: "/services/ntn-registration", destination: "/services/ntn-registration-individual", permanent: true },
      { source: "/services/company-registration", destination: "/services/private-limited-company-registration", permanent: true },
      { source: "/services/pseb-registration", destination: "/services/company-registration-pseb", permanent: true },
      { source: "/services/business-registration", destination: "/services/ntn-registration-business", permanent: true },

      // Old service pages - Tax & Registration
      { source: "/services/income-tax-return", destination: "/services/annual-tax-return-company", permanent: true },
      { source: "/services/sales-tax-filing", destination: "/services/gst-registration-trader", permanent: true },
      { source: "/services/sales-tax-return", destination: "/services/gst-registration-trader", permanent: true },

      // Old service pages - NGO & Nonprofits
      { source: "/services/npo-registration", destination: "/services/ntn-registration-ngo-npo", permanent: true },
      { source: "/services/ngo-registration", destination: "/services/ntn-registration-ngo-npo", permanent: true },

      // Old service pages - Intellectual Property
      { source: "/services/intellectual-property-registration", destination: "/services/trademark-registration", permanent: true },
      { source: "/services/copyright-registration", destination: "/services/trademark-registration", permanent: true },

      // Old service pages - Arms License (multiple regional variants)
      { source: "/services/arms-license", destination: "/services/arms-license-punjab-non-prohibitedbore", permanent: true },
      { source: "/services/kpk-arms-license-registration-service", destination: "/services/arms-license-all-pakistan-non-prohibited-bore", permanent: true },
      { source: "/services/arms-license-registration-service-in-lahore", destination: "/services/arms-license-punjab-non-prohibitedbore", permanent: true },
      { source: "/services/balochistan-arms-license-registration", destination: "/services/arms-license-all-pakistan-non-prohibited-bore", permanent: true },

      // Old service pages - Licenses handled by current canonical service pages.
    ];
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

export default nextConfig;

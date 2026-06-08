export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://zumarlawfirm.com/#localbusiness",
    "name": "Zumar Law Firm",
    "url": "https://zumarlawfirm.com",
    "logo": "https://zumarlawfirm.com/images/zumar-law-firm-logo.webp",
    "image": "https://zumarlawfirm.com/images/zumar-law-firm-hero.webp",
    "telephone": "+92-303-598-8574",
    "email": "team@zumarlawfirm.com",
    "description": "Professional tax, business registration, intellectual property, licensing, and regulatory services in Pakistan. Expert legal and corporate advisory.",
    "priceRange": "PKR 5,000 - PKR 500,000",
    "areaServed": [
      {
        "@type": "Country",
        "name": "Pakistan"
      },
      {
        "@type": "City",
        "name": "Lahore"
      },
      {
        "@type": "City",
        "name": "Rawalpindi"
      },
      {
        "@type": "City",
        "name": "Islamabad"
      }
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Lahore Branch",
        "addressLocality": "Lahore",
        "addressRegion": "Punjab",
        "postalCode": "54000",
        "addressCountry": "PK",
        "name": "Lahore Office"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Rawalpindi/Islamabad Branch",
        "addressLocality": "Rawalpindi",
        "addressRegion": "Punjab",
        "addressCountry": "PK",
        "name": "Rawalpindi/Islamabad Office"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00",
        "name": "Weekday Hours"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00",
        "name": "Saturday Hours"
      }
    ],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.5204,
      "longitude": 74.3587,
      "name": "Lahore Office"
    },
    "sameAs": [
      "https://www.facebook.com/zumarlawfirm",
      "https://www.linkedin.com/company/zumarlawfirm",
      "https://www.instagram.com/zumarlawfirm",
      "https://www.twitter.com/zumarlawfirm"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "telephone": "+92-303-598-8574",
        "email": "team@zumarlawfirm.com",
        "areaServed": "PK",
        "availableLanguage": "en",
        "hoursAvailable": "Mo-Fr 09:00-18:00, Sa 10:00-16:00"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Sales",
        "telephone": "+92-303-598-8574",
        "email": "sales@zumarlawfirm.com",
        "areaServed": "PK"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": "https://zumarlawfirm.com/#organization",
    "name": "Zumar Law Firm",
    "url": "https://zumarlawfirm.com",
    "logo": "https://zumarlawfirm.com/images/zumar-law-firm-logo.webp",
    "telephone": "+92-303-598-8574",
    "email": "team@zumarlawfirm.com",
    "description": "Professional tax, business registration, intellectual property, licensing, and regulatory services in Pakistan. Expert legal and corporate advisory.",
    "priceRange": "PKR 5,000 - PKR 500,000",
    "areaServed": [
      {
        "@type": "Country",
        "name": "Pakistan"
      },
      {
        "@type": "City",
        "name": "Lahore"
      },
      {
        "@type": "City",
        "name": "Rawalpindi"
      },
      {
        "@type": "City",
        "name": "Islamabad"
      }
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "addressLocality": "Lahore",
        "addressRegion": "Punjab",
        "addressCountry": "PK"
      },
      {
        "@type": "PostalAddress",
        "addressLocality": "Rawalpindi/Islamabad",
        "addressRegion": "Punjab",
        "addressCountry": "PK"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/zumarlawfirm",
      "https://www.linkedin.com/company/zumarlawfirm",
      "https://www.instagram.com/zumarlawfirm"
    ]
  };
}

export function generateServiceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://zumarlawfirm.com/services/${service.slug}#service`,
    "name": service.title,
    "description": service.summary,
    "url": `https://zumarlawfirm.com/services/${service.slug}`,
    "image": service.image || "https://zumarlawfirm.com/images/zumar-law-firm-logo.webp",
    "serviceType": service.category,
    "category": service.category,
    "provider": {
      "@type": "ProfessionalService",
      "@id": "https://zumarlawfirm.com/#organization",
      "name": "Zumar Law Firm",
      "url": "https://zumarlawfirm.com",
      "telephone": "+92-303-598-8574",
      "email": "team@zumarlawfirm.com"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Pakistan"
      },
      {
        "@type": "City",
        "name": "Lahore"
      },
      {
        "@type": "City",
        "name": "Rawalpindi"
      },
      {
        "@type": "City",
        "name": "Islamabad"
      }
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://app.zumarlawfirm.com/signup",
      "availableLanguage": ["en", "ur"],
      "servicePhone": "+92-303-598-8574"
    },
    "offers": {
      "@type": "Offer",
      "price": service.price || "5000",
      "priceCurrency": "PKR",
      "availability": "https://schema.org/InStock",
      "url": `https://zumarlawfirm.com/services/${service.slug}`
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+92-303-598-8574",
      "email": "team@zumarlawfirm.com",
      "availableLanguage": "en"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://zumarlawfirm.com${item.path}`
    }))
  };
}

export function generateFAQSchema(faqs, pageUrl = "https://zumarlawfirm.com") {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    "url": pageUrl,
    "mainEntity": faqs
      .filter((faq) => faq && faq.question && faq.answer)
      .map((faq) => ({
        "@type": "Question",
        "name": String(faq.question || "").trim(),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": String(faq.answer || "").trim().replace(/<[^>]*>/g, "")
        }
      }))
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://zumarlawfirm.com/#website",
    "url": "https://zumarlawfirm.com",
    "name": "Zumar Law Firm",
    "description": "Professional legal, tax, and corporate services in Pakistan",
    "publisher": {
      "@type": "LegalService",
      "@id": "https://zumarlawfirm.com/#organization",
      "name": "Zumar Law Firm"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://zumarlawfirm.com/api/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateServiceAreaSchema(area) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://zumarlawfirm.com/service-areas/${area.slug}#location`,
    "name": `Zumar Law Firm - ${area.title}`,
    "url": `https://zumarlawfirm.com/service-areas/${area.slug}`,
    "description": area.summary,
    "areaServed": {
      "@type": "City",
      "name": area.title
    },
    "serviceType": [
      "Tax Services",
      "Business Registration",
      "Corporate Law",
      "Intellectual Property",
      "Regulatory Licensing"
    ],
    "provider": {
      "@type": "LegalService",
      "name": "Zumar Law Firm",
      "url": "https://zumarlawfirm.com"
    }
  };
}

export function generateArticleSchema(blog) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://zumarlawfirm.com/blog/${blog.slug}#article`,
    "headline": blog.title,
    "description": blog.summary,
    "url": `https://zumarlawfirm.com/blog/${blog.slug}`,
    "datePublished": blog.date,
    "dateModified": blog.date,
    "author": {
      "@type": "Organization",
      "name": "Zumar Law Firm",
      "url": "https://zumarlawfirm.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zumar Law Firm",
      "url": "https://zumarlawfirm.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://zumarlawfirm.com/images/zumar-law-firm-logo.webp"
      }
    },
    "image": blog.image || "https://zumarlawfirm.com/images/zumar-law-firm-logo.webp"
  };
}

export function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Zumar Law Firm",
    "url": "https://zumarlawfirm.com/contact",
    "mainEntity": {
      "@type": "LegalService",
      "@id": "https://zumarlawfirm.com/#organization",
      "name": "Zumar Law Firm",
      "telephone": "+92-303-598-8574",
      "email": "team@zumarlawfirm.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": "en",
        "telephone": "+92-303-598-8574"
      }
    }
  };
}

export function generateAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Zumar Law Firm",
    "url": "https://zumarlawfirm.com/about",
    "mainEntity": {
      "@type": "LegalService",
      "@id": "https://zumarlawfirm.com/#organization",
      "name": "Zumar Law Firm",
      "description": "A professional services firm focused on tax, business registration, regulatory licensing, and compliance support for individuals and businesses in Pakistan.",
      "url": "https://zumarlawfirm.com"
    }
  };
}

export function generateGraph(schemas = []) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}

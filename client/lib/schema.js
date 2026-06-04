/**
 * JSON-LD Schema Generator for SEO
 * Generates structured data for Google, Bing, and other search engines
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": "https://zumarlawfirm.com/#organization",
    "name": "Zumar Law Firm",
    "url": "https://zumarlawfirm.com",
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
    "serviceType": service.category,
    "provider": {
      "@type": "LegalService",
      "@id": "https://zumarlawfirm.com/#organization",
      "name": "Zumar Law Firm",
      "url": "https://zumarlawfirm.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://app.zumarlawfirm.com/signup",
      "availableLanguage": "en"
    },
    "offers": {
      "@type": "Offer",
      "price": service.price || "5000",
      "priceCurrency": "PKR",
      "availability": "https://schema.org/InStock"
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

export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://zumarlawfirm.com/#faq",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
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
        "url": "https://zumarlawfirm.com/images/zumar-logo.webp"
      }
    },
    "image": blog.image || "https://zumarlawfirm.com/images/zumar-logo.webp"
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

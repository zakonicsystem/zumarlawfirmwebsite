import HomeHeroSlider from "@/components/HomeHeroSlider";
import HomeStatsSection from "@/components/HomeStatsSection";
import Reveal from "@/components/Reveal";
import {
  HomeBranchesSection,
  HomeFeaturedSection,
  HomeFaqSection,
  HomeProcessSection,
  HomeServiceAreasSection,
  HomeServicesSection,
  HomeTestimonialsSection,
  HomeUpdatesSection,
  HomeWhyChooseSection,
  HomeYoutubeSection,
  SectionDivider
} from "@/components/HomeSections";
import { readCmsData } from "@/lib/cmsStore";
import { getPageMetadata } from "@/lib/seo";
import { toServiceCards } from "@/lib/serviceCards";
import JsonLd from "@/components/JsonLd";
import { generateFAQSchema, generateLocalBusinessSchema } from "@/lib/schema";

export async function generateMetadata() {
  return getPageMetadata("home");
}

export default async function HomePage() {
  const cms = await readCmsData();
  const home = Object.fromEntries(cms.homeSections.map((section) => [section.id, section]));
  const services = cms.services.filter((service) => service.enabled !== false);
  const serviceSelections = cms.homeContent?.serviceSelections || {};
  const featuredServices = toServiceCards(selectServices(services, serviceSelections.featuredSlugs, 14));
  const homeGridServices = toServiceCards(selectServices(services, serviceSelections.homeGridSlugs, 6));
  const newsItems = cms.news.filter((item) => item.enabled !== false);
  const blogPosts = cms.blogs.filter((post) => post.enabled !== false);
  const homeFaqItems = (cms.homeContent?.faq?.items || []).filter((item) => item.enabled !== false);

  return (
    <>
      <JsonLd schema={generateLocalBusinessSchema()} />
      {homeFaqItems.length ? <JsonLd schema={generateFAQSchema(homeFaqItems, "https://zumarlawfirm.com")} /> : null}
      <Reveal />
      <HomeHeroSlider slides={cms.heroSlides} />
      <HomeStatsSection stats={cms.homeStats} />
      <SectionDivider />
      <HomeWhyChooseSection content={cms.homeContent?.whyChoose} />
      <SectionDivider />
      <HomeFeaturedSection section={home.featured} services={featuredServices} />
      <SectionDivider />
      <HomeProcessSection section={cms.homeContent?.sharedProcess} steps={cms.homeContent?.sharedProcess?.steps} />
      <SectionDivider />
      <HomeServicesSection section={home.services} services={homeGridServices} categories={cms.categories} />
      <SectionDivider />
      <HomeServiceAreasSection content={cms.homeContent?.serviceAreas} serviceAreas={cms.serviceAreas} />
      <SectionDivider />
      <HomeTestimonialsSection content={cms.homeContent?.testimonials} />
      <SectionDivider />
      <HomeUpdatesSection content={cms.homeContent?.updates} newsItems={newsItems} blogPosts={blogPosts} />
      <SectionDivider />
      <HomeFaqSection content={{ ...(cms.homeContent?.faq || {}), items: homeFaqItems }} />
      <HomeYoutubeSection content={cms.homeContent?.youtubeVideos} />
      <HomeBranchesSection content={cms.homeContent?.branches} branches={cms.branches} />
    </>
  );
}

function selectServices(services, slugs = [], fallbackLimit = services.length) {
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return services.slice(0, fallbackLimit);
  }

  const selected = new Set(slugs);
  return services.filter((service) => selected.has(service.slug));
}

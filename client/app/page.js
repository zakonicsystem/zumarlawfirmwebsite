import HomeHeroSlider from "@/components/HomeHeroSlider";
import HomeStatsSection from "@/components/HomeStatsSection";
import Reveal from "@/components/Reveal";
import {
  HomeBranchesSection,
  HomeFeaturedSection,
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
import JsonLd from "@/components/JsonLd";
import { generateWebsiteSchema } from "@/lib/schema";

export async function generateMetadata() {
  const metadata = await getPageMetadata("home");
  return {
    ...metadata,
    canonical: "https://zumarlawfirm.com",
    alternates: {
      canonical: "https://zumarlawfirm.com"
    }
  };
}

export default async function HomePage() {
  const cms = await readCmsData();
  const home = Object.fromEntries(cms.homeSections.map((section) => [section.id, section]));
  const services = cms.services.filter((service) => service.enabled !== false);
  const serviceSelections = cms.homeContent?.serviceSelections || {};
  const featuredServices = selectServices(services, serviceSelections.featuredSlugs, 14);
  const homeGridServices = selectServices(services, serviceSelections.homeGridSlugs, 6);
  const newsItems = cms.news.filter((item) => item.enabled !== false);
  const blogPosts = cms.blogs.filter((post) => post.enabled !== false);

  return (
    <>
      <JsonLd schema={generateWebsiteSchema()} />
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

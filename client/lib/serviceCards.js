export function toServiceCard(service = {}) {
  return {
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    category: service.category,
    serviceType: service.serviceType,
    icon: service.icon,
    formattedPrice: service.formattedPrice,
    enabled: service.enabled
  };
}

export function toServiceCards(services = []) {
  return services.map((service) => toServiceCard(service));
}

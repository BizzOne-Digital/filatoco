import { SITE_NAME, SITE_ORIGIN, DEFAULT_OG_IMAGE } from '../components/Seo';

// Only real, known business info goes here — no invented address or hours.
export const organizationSchema = (settings) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_ORIGIN,
  logo: DEFAULT_OG_IMAGE,
  description: 'Handmade crochet and tapestry purses, crafted with passion and individuality.',
  ...(settings?.email || settings?.phone
    ? {
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          ...(settings?.email ? { email: settings.email } : {}),
          ...(settings?.phone ? { telephone: settings.phone } : {}),
        },
      }
    : {}),
  ...(settings?.instagram ? { sameAs: [`https://instagram.com/${settings.instagram}`] } : {}),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_ORIGIN,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_ORIGIN}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_ORIGIN}${item.path}`,
  })),
});

export const productSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.seoDescription || product.shortDescription || product.description,
  image: product.images?.map((img) => img.url) || [],
  sku: product.sku || undefined,
  brand: { '@type': 'Brand', name: SITE_NAME },
  category: product.category?.name,
  offers: {
    '@type': 'Offer',
    url: `${SITE_ORIGIN}/product/${product.slug}`,
    priceCurrency: 'CAD',
    price: product.price,
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
  },
});

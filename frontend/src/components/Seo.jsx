import { Helmet } from 'react-helmet-async';

export const SITE_NAME = 'FilatoCo';
export const SITE_ORIGIN = 'https://filatoco.ca';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/logo.png`;

/**
 * Central SEO tag manager: title, meta description, canonical, robots,
 * Open Graph, Twitter Card, and optional JSON-LD structured data.
 *
 * `path` must be the site-relative path (e.g. "/shop") — canonical and
 * og:url are built from it against SITE_ORIGIN so they stay correct
 * regardless of which domain currently serves the app.
 */
const Seo = ({ title, description, path = '/', image = DEFAULT_OG_IMAGE, noindex = false, type = 'website', jsonLd }) => {
  const url = `${SITE_ORIGIN}${path}`;
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
};

export default Seo;

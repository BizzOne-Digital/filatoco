import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/structuredData';

const LegalPage = ({ title, description, path, children }) => (
  <>
    <Seo
      title={`${title} | FilatoCo`}
      description={description}
      path={path}
      jsonLd={path ? breadcrumbSchema([{ name: 'Home', path: '/' }, { name: title, path }]) : undefined}
    />
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="section-heading">{title}</h1>
      <div className="prose prose-sm mt-8 max-w-none text-brown/70">{children}</div>
    </div>
  </>
);

export default LegalPage;

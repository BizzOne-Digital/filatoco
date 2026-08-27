import { Helmet } from 'react-helmet-async';

const LegalPage = ({ title, children }) => (
  <>
    <Helmet><title>{title} | FilatoCo</title></Helmet>
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="section-heading">{title}</h1>
      <div className="prose prose-sm mt-8 max-w-none text-brown/70">{children}</div>
    </div>
  </>
);

export default LegalPage;

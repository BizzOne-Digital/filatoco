import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => (
  <>
    <Helmet><title>Page Not Found | FilatoCo</title></Helmet>
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="font-serif text-6xl text-terracotta">404</p>
      <h1 className="mt-4 font-serif text-2xl text-brown">This page seems to have unraveled.</h1>
      <p className="mt-2 text-brown/60">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  </>
);

export default NotFound;

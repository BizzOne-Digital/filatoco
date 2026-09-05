import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import api from '../services/api';
import { organizationSchema, websiteSchema } from '../utils/structuredData';

const MainLayout = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data.settings)).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema(settings))}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema())}</script>
      </Helmet>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;

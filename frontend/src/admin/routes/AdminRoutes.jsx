import { Routes, Route, Navigate } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import Orders from '../pages/Orders';
import Customers from '../pages/Customers';
import CustomRequests from '../pages/CustomRequests';
import Appointments from '../pages/Appointments';
import Testimonials from '../pages/Testimonials';
import Gallery from '../pages/Gallery';
import Newsletter from '../pages/Newsletter';
import Messages from '../pages/Messages';
import HomepageContent from '../pages/HomepageContent';
import SettingsPage from '../pages/SettingsPage';
import Profile from '../pages/Profile';

const AdminRoutes = () => (
  <Routes>
    <Route path="login" element={<AdminLogin />} />

    <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="custom-requests" element={<CustomRequests />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="messages" element={<Messages />} />
        <Route path="homepage" element={<HomepageContent />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
  </Routes>
);

export default AdminRoutes;

import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomRequest from './pages/CustomRequest';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyAccount from './pages/MyAccount';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import ShippingReturns from './pages/legal/ShippingReturns';
import CareInstructions from './pages/legal/CareInstructions';
import FAQ from './pages/legal/FAQ';
import NotFound from './pages/NotFound';

import AdminRoutes from './admin/routes/AdminRoutes';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productType" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/custom-request" element={<CustomRequest />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/care-instructions" element={<CareInstructions />} />
        <Route path="/faq" element={<FAQ />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-account" element={<MyAccount />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
      </Routes>
    </>
  );
}

export default App;

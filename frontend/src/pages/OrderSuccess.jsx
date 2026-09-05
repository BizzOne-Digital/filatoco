import { useLocation, Link, Navigate } from 'react-router-dom';
import Seo from '../components/Seo';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <>
      <Seo title="Order Confirmed | FilatoCo" path="/order-success" noindex />
      <div className="mx-auto max-w-xl px-5 py-20 text-center md:px-8">
        <CheckCircle className="mx-auto text-sage" size={56} />
        <h1 className="section-heading mt-6">Thank You, {order.customer.firstName}!</h1>
        <p className="mt-3 text-brown/70">Your handmade order has been received.</p>
        <p className="mt-1 text-sm text-brown/50">Order Number: <strong>{order.orderNumber}</strong></p>
        <p className="mt-6 text-sm text-brown/60">A confirmation email has been sent to {order.customer.email}. We'll notify you as your bag is lovingly prepared.</p>
        <Link to="/shop" className="btn-primary mt-8 inline-flex">Continue Shopping</Link>
      </div>
    </>
  );
};

export default OrderSuccess;

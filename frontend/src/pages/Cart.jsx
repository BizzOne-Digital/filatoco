import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <>
      <Seo title="Your Bag | FilatoCo" path="/cart" noindex />
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <h1 className="section-heading">Your Bag</h1>

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-brown/60">Your bag is currently empty.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-flex">Shop Collection</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            <ul className="space-y-6 md:col-span-2">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 border-b border-beige pb-6">
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <Link to={`/product/${item.slug}`} className="font-medium text-brown">{item.name}</Link>
                    <p className="text-terracotta">${item.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="rounded-full border border-beige p-1"><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="rounded-full border border-beige p-1"><Plus size={14} /></button>
                      <button onClick={() => removeItem(item.productId)} className="ml-3 flex items-center gap-1 text-sm text-brown/50 hover:text-terracotta"><Trash2 size={15} /> Remove</button>
                    </div>
                  </div>
                  <p className="font-medium text-brown">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>

            <div className="h-fit rounded-xl2 bg-offwhite p-6 shadow-soft">
              <h2 className="font-serif text-xl text-brown">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm text-brown/70">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-brown/70">
                <span>Shipping</span><span>Calculated at checkout</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-beige pt-4 font-semibold text-brown">
                <span>Estimated Total</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn-primary mt-6 w-full">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;

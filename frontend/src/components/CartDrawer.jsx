import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { items, drawerOpen, setDrawerOpen, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-brown/40"
          onClick={() => setDrawerOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-offwhite"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-beige p-5">
              <h2 className="font-serif text-xl text-brown">Your Bag ({items.length})</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close cart"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <p className="mt-10 text-center text-sm text-brown/60">Your bag is empty.</p>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brown">{item.name}</p>
                        <p className="text-sm text-terracotta">${item.price.toFixed(2)}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="rounded-full border border-beige p-1"><Minus size={14} /></button>
                          <span className="text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="rounded-full border border-beige p-1"><Plus size={14} /></button>
                          <button onClick={() => removeItem(item.productId)} className="ml-2 text-brown/50 hover:text-terracotta"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-beige p-5">
                <div className="mb-4 flex justify-between text-sm text-brown">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <Link to="/cart" onClick={() => setDrawerOpen(false)} className="btn-secondary mb-2 w-full">View Cart</Link>
                <Link to="/checkout" onClick={() => setDrawerOpen(false)} className="btn-primary w-full">Checkout</Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

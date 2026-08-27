import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/shop', label: 'Shop' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setDrawerOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-offwhite/95 backdrop-blur shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="FilatoCo" className="h-10 w-auto md:h-12" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative text-sm font-medium text-brown/80 transition-colors hover:text-terracotta after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full ${
                  isActive ? 'text-terracotta after:w-full' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/search" aria-label="Search" className="hidden text-brown hover:text-terracotta md:block">
            <Search size={20} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="hidden text-brown hover:text-terracotta md:block">
            <Heart size={20} />
          </Link>
          <button
            aria-label="Cart"
            onClick={() => setDrawerOpen(true)}
            className="relative text-brown hover:text-terracotta"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] text-cream">
                {itemCount}
              </span>
            )}
          </button>
          <Link to="/my-account" aria-label="Account" className="hidden text-brown hover:text-terracotta md:block">
            <User size={20} />
          </Link>
          <button aria-label="Menu" className="text-brown md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brown/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="ml-auto flex h-full w-4/5 max-w-xs flex-col gap-6 bg-cream p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="self-end text-brown" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="font-serif text-2xl text-brown" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex gap-5 border-t border-beige pt-4">
                <Link to="/search" onClick={() => setMobileOpen(false)}><Search size={20} /></Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)}><Heart size={20} /></Link>
                <Link to="/my-account" onClick={() => setMobileOpen(false)}><User size={20} /></Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-beige bg-cream">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-14 md:grid-cols-5 md:px-8">
      <div className="col-span-2">
        <img src="/logo.png" alt="FilatoCo" className="h-10 w-auto" />
        <p className="mt-3 max-w-xs text-sm text-brown/70">
          Handmade crochet, tapestry and sewn purses crafted with passion, individuality and care.
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">Shop</p>
        <ul className="mt-4 space-y-2 text-sm text-brown/70">
          <li><Link to="/shop">All Collections</Link></li>
          <li><Link to="/shop/shoulder-bag">Shoulder Bags</Link></li>
          <li><Link to="/shop/handbag">Handbags</Link></li>
          <li><Link to="/shop/crossbody">Crossbody</Link></li>
          <li><Link to="/shop/tote">Tote</Link></li>
          <li><Link to="/shop/clutch">Clutch</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">Company</p>
        <ul className="mt-4 space-y-2 text-sm text-brown/70">
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/about">Our Story</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">Customer Care</p>
        <ul className="mt-4 space-y-2 text-sm text-brown/70">
          <li><Link to="/shipping-returns">Shipping &amp; Returns</Link></li>
          <li><Link to="/care-instructions">Care Instructions</Link></li>
          <li><Link to="/faq">FAQs</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms &amp; Conditions</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-beige px-5 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-xs text-brown/60">© {new Date().getFullYear()} FilatoCo.ca. All rights reserved.</p>
        <div className="flex gap-4 text-brown/70">
          <a href="https://instagram.com/filatoco" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

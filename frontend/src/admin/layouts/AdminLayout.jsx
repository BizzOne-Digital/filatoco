import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Wand2, CalendarDays,
  MessageSquareQuote, Image, Mail, MessageCircle, Home, Settings, User, LogOut, Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/custom-requests', label: 'Custom Requests', icon: Wand2 },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/messages', label: 'Contact Messages', icon: MessageCircle },
  { to: '/admin/homepage', label: 'Homepage', icon: Home },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cream md:flex">
      <button className="fixed left-4 top-4 z-40 rounded-full bg-brown p-2 text-cream md:hidden" onClick={() => setSidebarOpen(true)}>
        <Menu size={18} />
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-brown text-cream transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-6">
          <p className="font-serif text-xl">FilatoCo Admin</p>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-terracotta text-cream' : 'text-cream/70 hover:bg-cream/10'
                }`
              }
            >
              <item.icon size={16} /> {item.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-cream/70 hover:bg-cream/10">
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

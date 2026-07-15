import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Search, Heart, Shield } from 'lucide-react';
import { useCart, useAuth } from '../context/StoreContext';
import TermsAlert from './TermsAlert';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop/electronics', label: 'Electronics' },
    { to: '/shop/fashion', label: 'Fashion' },
    { to: '/shop/home', label: 'Home & Living' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TermsAlert />
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-11 h-11 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <span className="font-display text-dark-950 font-bold text-sm tracking-tight">UK</span>
              </motion.div>
              <span className="font-display text-xl md:text-2xl font-semibold gold-text hidden sm:block">UK Services</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-gold-400 ${
                    location.pathname === link.to ? 'text-gold-400' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 md:gap-5">
              <button onClick={() => setSearchOpen(!searchOpen)} className="btn-ghost p-2">
                <Search size={20} />
              </button>

              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  {user.is_staff && (
                    <Link to="/admin" className="btn-ghost p-2 text-gold-400" title="Admin Dashboard">
                      <Shield size={20} />
                    </Link>
                  )}
                  <Link to="/wishlist" className="btn-ghost p-2">
                    <Heart size={20} />
                  </Link>
                  <Link to="/orders" className="btn-ghost text-sm">{user.username}</Link>
                  <button onClick={logout} className="btn-ghost text-sm text-gray-400">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="btn-ghost p-2 hidden md:block">
                  <User size={20} />
                </Link>
              )}

              <Link to="/cart" className="relative btn-ghost p-2">
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {cart.total_items > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-dark-950 text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cart.total_items}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost p-2 lg:hidden">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="overflow-hidden pb-4"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search UK Services products..."
                  className="input-field"
                  autoFocus
                />
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-dark-800 overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-300 hover:text-gold-400 py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-gold-400 py-2">
                    Login / Register
                  </Link>
                )}
                {user && (
                  <>
                    {user.is_staff && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-gold-400 hover:text-gold-300 py-2 font-medium">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-gold-400 py-2">
                      Wishlist
                    </Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-gold-400 py-2">
                      My Orders
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-16 md:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-dark-900 border-t border-dark-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="font-display text-2xl gold-text mb-4">UK Services</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted UK destination for premium products and exceptional service, delivered with care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/shop/electronics" className="hover:text-gold-400 transition-colors">Electronics</Link></li>
                <li><Link to="/shop/fashion" className="hover:text-gold-400 transition-colors">Fashion</Link></li>
                <li><Link to="/shop/home" className="hover:text-gold-400 transition-colors">Home & Living</Link></li>
                <li><Link to="/shop/beauty" className="hover:text-gold-400 transition-colors">Beauty</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/terms#privacy-policy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms#refund-and-cancellation-policy" className="hover:text-gold-400 transition-colors">Refund Policy</Link></li>
                <li><Link to="/terms#return-policy" className="hover:text-gold-400 transition-colors">Return Policy</Link></li>
                <li><Link to="/terms#shipping-policy" className="hover:text-gold-400 transition-colors">Shipping Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Get exclusive offers and early access.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="input-field text-sm flex-1" />
                <button className="btn-primary text-sm px-4 py-2 whitespace-nowrap">Join</button>
              </div>
            </div>
          </div>
          <div className="border-t border-dark-800 mt-12 pt-8 text-center text-sm text-gray-500">
            © 2026 UK Services. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

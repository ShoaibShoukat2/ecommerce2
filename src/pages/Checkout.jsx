import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { checkout } from '../api';
import { useCart } from '../context/StoreContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../utils/currency';

export default function Checkout() {
  const { cart, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_zip: '',
    notes: '',
  });

  const shipping = cart.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = Number(cart.subtotal) + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await checkout(form);
      await clear();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.order_number}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items?.length) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400 mb-4">Your cart is empty</p>
        <Link to="/shop" className="btn-primary">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="card-premium p-6">
            <h2 className="font-semibold text-white mb-6">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                <input name="shipping_name" value={form.shipping_name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input name="shipping_email" type="email" value={form.shipping_email} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
                <input name="shipping_phone" value={form.shipping_phone} onChange={handleChange} required className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1.5">Address</label>
                <input name="shipping_address" value={form.shipping_address} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">City</label>
                <input name="shipping_city" value={form.shipping_city} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">ZIP Code</label>
                <input name="shipping_zip" value={form.shipping_zip} onChange={handleChange} required className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1.5">Order Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-field resize-none" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-gold-400" /> Payment
            </h2>
            <p className="text-gray-400 text-sm">
              Payment integration can be added here (Stripe, PayPal, etc.). For now, orders are placed with Cash on Delivery.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-6 h-fit sticky top-28"
        >
          <h2 className="font-semibold text-white mb-6">Your Order</h2>

          <div className="space-y-3 mb-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-400">{item.product.name} × {item.quantity}</span>
                <span className="text-white">{formatPrice(item.total_price)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dark-700 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span className="text-white">Total</span>
              <span className="gold-text">{formatPrice(total)}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock size={16} />
            {loading ? 'Processing...' : 'Place Order'}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}

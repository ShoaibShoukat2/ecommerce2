import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { checkout, createRazorpayOrder, verifyRazorpayPayment } from '../api';
import { useCart } from '../context/StoreContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../utils/currency';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay';

export default function Checkout() {
  const { cart, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('idle'); // idle | creating | verifying
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
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

  const completeOrder = async (orderNumber) => {
    await clear();
    toast.success('Order placed successfully!');
    navigate(`/order-success/${orderNumber}`);
  };

  const handleRazorpayPayment = async () => {
    // Step 1: Load Razorpay script
    try {
      await loadRazorpayScript();
    } catch (err) {
      throw new Error('Could not load payment gateway. Please check your internet connection.');
    }

    // Step 2: Create order on backend
    setPaymentStep('creating');
    let paymentOrder;
    try {
      const { data } = await createRazorpayOrder(form);
      paymentOrder = data;
    } catch (err) {
      throw err;
    }

    // Step 3: Open Razorpay modal
    // Reset loading so button is not stuck — Razorpay handles UI from here
    setLoading(false);
    setPaymentStep('idle');

    return new Promise((resolve, reject) => {
      let razorpayInstance;
      try {
        razorpayInstance = openRazorpayCheckout({
          keyId: paymentOrder.key_id,
          orderId: paymentOrder.razorpay_order_id,
          amount: paymentOrder.amount,   // paise — correct for Razorpay
          currency: paymentOrder.currency,
          name: form.shipping_name,
          email: form.shipping_email,
          phone: form.shipping_phone,
          onSuccess: async (response) => {
            setLoading(true);
            setPaymentStep('verifying');
            try {
              const { data } = await verifyRazorpayPayment({
                ...form,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              await completeOrder(data.order_number);
              resolve(data);
            } catch (err) {
              setLoading(false);
              setPaymentStep('idle');
              toast.error(err.response?.data?.error || 'Payment verification failed');
              reject(err);
            }
          },
          onDismiss: () => {
            setLoading(false);
            setPaymentStep('idle');
            toast.error('Payment cancelled');
            reject(new Error('Payment cancelled'));
          },
          onPaymentFailed: (error) => {
            setLoading(false);
            setPaymentStep('idle');
            const msg = error?.description || error?.reason || 'Payment failed. Please try again.';
            toast.error(msg);
            reject(new Error(msg));
          },
        });
      } catch (err) {
        // openRazorpayCheckout itself threw (e.g. invalid key, initialization error)
        setLoading(false);
        setPaymentStep('idle');
        toast.error(err.message || 'Could not open payment gateway');
        reject(err);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStep('creating');
    try {
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment();
      } else {
        const { data } = await checkout(form);
        await completeOrder(data.order_number);
      }
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        // Payment cancelled toast already shown in onDismiss
        if (err.response) {
          toast.error(err.response?.data?.error || 'Checkout failed');
        } else if (err.message) {
          toast.error(err.message);
        }
      }
    } finally {
      setLoading(false);
      setPaymentStep('idle');
    }
  };

  const getButtonLabel = () => {
    if (paymentStep === 'creating') return 'Creating order...';
    if (paymentStep === 'verifying') return 'Verifying payment...';
    if (loading) return 'Processing...';
    if (paymentMethod === 'razorpay') return `Pay ${formatPrice(total)}`;
    return 'Place Order';
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
              <CreditCard size={20} className="text-gold-400" /> Payment Method
            </h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === 'razorpay' ? 'border-gold-400 bg-gold-400/10' : 'border-dark-700 hover:border-dark-600'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-gold-400"
                />
                <CreditCard size={18} className="text-gold-400 shrink-0" />
                <div>
                  <p className="text-white font-medium">Pay with Razorpay</p>
                  <p className="text-gray-400 text-sm">UPI, cards, net banking & wallets</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === 'cod' ? 'border-gold-400 bg-gold-400/10' : 'border-dark-700 hover:border-dark-600'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-gold-400"
                />
                <Banknote size={18} className="text-gold-400 shrink-0" />
                <div>
                  <p className="text-white font-medium">Cash on Delivery</p>
                  <p className="text-gray-400 text-sm">Pay when your order arrives</p>
                </div>
              </label>
            </div>
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
            {getButtonLabel()}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}

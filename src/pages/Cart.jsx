import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/StoreContext';

export default function Cart() {
  const { cart, updateItem, removeItem } = useCart();
  const shipping = cart.subtotal >= 100 ? 0 : 9.99;
  const total = Number(cart.subtotal) + shipping;

  if (!cart.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ShoppingBag className="mx-auto text-dark-600 mb-6" size={64} />
          <h1 className="section-title mb-3">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">Discover our premium collection and find something you love.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="card-premium p-5 flex gap-5"
              >
                <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <img
                    src={item.product.display_image}
                    alt={item.product.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${item.product.slug}`}>
                      <h3 className="font-medium text-white hover:text-gold-300 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.category_name}</p>
                    <p className="text-gold-400 font-semibold mt-2">${item.product.price}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-dark-800 rounded-lg border border-dark-600">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        className="p-2 text-gray-400 hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="p-2 text-gray-400 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-white">${item.total_price}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-6 sticky top-28"
          >
            <h2 className="font-semibold text-white text-lg mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cart.total_items} items)</span>
                <span className="text-white">${cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-white">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {cart.subtotal < 100 && (
                <p className="text-xs text-gold-500/80">
                  Add ${(100 - cart.subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div className="border-t border-dark-700 my-5 pt-5 flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="text-xl font-bold gold-text">${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            <Link to="/shop" className="btn-ghost w-full text-center mt-3 text-sm block">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, useWishlist, useCart } from '../context/StoreContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/currency';

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, fetchWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user, fetchWishlist]);

  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-10">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="mx-auto text-dark-600 mb-4" size={48} />
          <p className="text-gray-400 mb-4">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-premium overflow-hidden"
            >
              <Link to={`/product/${item.product.slug}`}>
                <div className="aspect-[4/5] overflow-hidden bg-dark-800">
                  <img
                    src={item.product.display_image}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
              <div className="p-5">
                <p className="text-xs text-gold-500/80 uppercase tracking-wider mb-1">
                  {item.product.category_name}
                </p>
                <Link to={`/product/${item.product.slug}`}>
                  <h3 className="font-medium text-white hover:text-gold-300 transition-colors line-clamp-1">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-lg font-semibold text-white mt-2">{formatPrice(item.product.price)}</p>
                <button
                  onClick={() => handleAddToCart(item.product.id)}
                  className="btn-primary w-full mt-4 text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

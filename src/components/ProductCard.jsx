import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Sparkles, Heart } from 'lucide-react';
import { useCart, useAuth, useWishlist } from '../context/StoreContext';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggle, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(product.id);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save wishlist');
      navigate('/login');
      return;
    }
    try {
      const result = await toggle(product.id);
      toast.success(result.wishlisted ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="card-premium overflow-hidden group-hover:shadow-2xl group-hover:shadow-gold-500/5">
          <div className="relative aspect-[4/5] overflow-hidden bg-dark-800">
            <motion.img
              src={product.display_image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {product.discount_percent > 0 && (
              <span className="absolute top-3 left-3 bg-gold-500 text-dark-950 text-xs font-bold px-2.5 py-1 rounded-full">
                -{product.discount_percent}%
              </span>
            )}
            {product.is_new && (
              <span className="absolute top-3 right-12 bg-dark-950/80 backdrop-blur text-gold-400 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={10} /> New
              </span>
            )}

            <motion.button
              onClick={handleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur transition-colors ${
                wishlisted ? 'bg-gold-500 text-dark-950' : 'bg-dark-950/80 text-gray-300 hover:text-gold-400'
              }`}
            >
              <Heart size={14} className={wishlisted ? 'fill-current' : ''} />
            </motion.button>

            <motion.button
              onClick={handleAddToCart}
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-4 left-4 right-4 btn-primary text-sm py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Add to Cart
            </motion.button>
          </div>

          <div className="p-5">
            <p className="text-xs text-gold-500/80 uppercase tracking-wider mb-1">{product.category_name}</p>
            <h3 className="font-medium text-white group-hover:text-gold-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <Star size={12} className="fill-gold-400 text-gold-400" />
              <span className="text-xs text-gray-400">{product.rating} ({product.review_count})</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-lg font-semibold text-white">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.compare_price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

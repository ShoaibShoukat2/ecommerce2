import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Minus, Plus, ArrowLeft, Truck, Shield, Check, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProduct } from '../api';
import { useCart, useAuth, useWishlist } from '../context/StoreContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toggle, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProduct(slug)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
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

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400 text-lg mb-4">Product not found</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/shop" className="btn-ghost inline-flex items-center gap-2 mb-8 text-sm">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="card-premium overflow-hidden aspect-square">
            <img
              src={product.display_image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.discount_percent > 0 && (
            <span className="absolute top-4 left-4 bg-gold-500 text-dark-950 font-bold px-3 py-1.5 rounded-full">
              Save {product.discount_percent}%
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gold-400 text-sm uppercase tracking-wider mb-2">{product.category_name}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? 'fill-gold-400 text-gold-400' : 'text-dark-600'}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">{product.rating} ({product.review_count} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-white">${product.price}</span>
            {product.compare_price && (
              <span className="text-xl text-gray-500 line-through">${product.compare_price}</span>
            )}
          </div>

          <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <Check size={16} className="text-green-400" />
            <span className="text-sm text-gray-300">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center bg-dark-800 rounded-lg border border-dark-600">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-gray-400 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 text-gray-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleWishlist}
              className={`p-3 rounded-lg border transition-colors ${
                isWishlisted(product.id)
                  ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                  : 'border-dark-600 text-gray-400 hover:border-gold-500/50 hover:text-gold-400'
              }`}
            >
              <Heart size={18} className={isWishlisted(product.id) ? 'fill-current' : ''} />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card-premium p-4 flex items-center gap-3">
              <Truck className="text-gold-400" size={20} />
              <div>
                <p className="text-sm font-medium text-white">Free Shipping</p>
                <p className="text-xs text-gray-500">Orders over $100</p>
              </div>
            </div>
            <div className="card-premium p-4 flex items-center gap-3">
              <Shield className="text-gold-400" size={20} />
              <div>
                <p className="text-sm font-medium text-white">2 Year Warranty</p>
                <p className="text-xs text-gray-500">Full coverage</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

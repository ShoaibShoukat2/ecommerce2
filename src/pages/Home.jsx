import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, RefreshCw, Sparkles } from 'lucide-react';
import { getFeaturedProducts, getCategories } from '../api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSpinner';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedProducts(), getCategories()])
      .then(([featRes, catRes]) => {
        setFeatured(featRes.data);
        setCategories(catRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/90 to-dark-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
        </div>

        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 mb-6">
              <Sparkles className="text-gold-400" size={18} />
              <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">
                UK Services — Premium Collection 2026
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Welcome to
              <span className="block gold-text">UK Services</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Shop premium products with trusted UK service — quality, style, and fast delivery you can count on.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2">
                Explore Collection <ArrowRight size={18} />
              </Link>
              <Link to="/shop?featured=true" className="btn-outline">
                Featured Items
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: Shield, title: 'Secure Payment', desc: '100% protected checkout' },
            { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <feat.icon className="text-gold-400" size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feat.title}</h3>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="section-title mb-3">Shop by Category</h2>
          <p className="text-gray-400">Find exactly what you're looking for</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/shop/${cat.slug}`}
                className="group block card-premium p-6 text-center hover:shadow-lg hover:shadow-gold-500/5"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="font-display text-2xl gold-text">{cat.name[0]}</span>
                </div>
                <h3 className="font-medium text-white group-hover:text-gold-300 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.product_count} items</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-dark-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="section-title mb-3">Featured Products</h2>
              <p className="text-gray-400">Top picks from UK Services</p>
            </div>
            <Link to="/shop?featured=true" className="btn-ghost hidden md:flex items-center gap-1 text-gold-400">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200"
            alt="CTA"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 to-dark-950/50 flex items-center">
            <div className="p-10 md:p-16">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Join <span className="gold-text">UK Services</span> Today
              </h2>
              <p className="text-gray-300 mb-8 max-w-md">
                Create your account and get 15% off your first order with exclusive UK member offers.
              </p>
              <Link to="/register" className="btn-primary">Create Account</Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

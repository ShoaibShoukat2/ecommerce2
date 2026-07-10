import { useEffect, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSpinner';

export default function Shop() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('-created_at');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { sort };
    if (category) params.category = category;
    if (search) params.search = search;
    if (featured) params.featured = 'true';
    getProducts(params)
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, [category, search, featured, sort]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="section-title mb-2">
          {search ? `Results for "${search}"` : activeCategory ? activeCategory.name : 'All Products'}
        </h1>
        <p className="text-gray-400">
          {!loading && `${products.length} product${products.length !== 1 ? 's' : ''} found`}
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card-premium p-6 sticky top-28">
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                    !category ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop/${cat.slug}`}
                    className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                      category === cat.slug ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {cat.name}
                    <span className="text-gray-600 ml-1">({cat.product_count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline text-sm py-2 px-4 flex items-center gap-2 lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto text-sm py-2"
            >
              <option value="-created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Top Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

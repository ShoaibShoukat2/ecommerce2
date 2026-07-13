import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, IndianRupee, AlertTriangle, Users, FolderOpen } from 'lucide-react';
import { getAdminDashboard } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/currency';

const statCards = [
  { key: 'total_products', label: 'Products', icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { key: 'total_orders', label: 'Orders', icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { key: 'total_revenue', label: 'Revenue', icon: IndianRupee, color: 'text-green-400', bg: 'bg-green-400/10', format: 'price' },
  { key: 'pending_orders', label: 'Pending', icon: ShoppingCart, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { key: 'low_stock_products', label: 'Low Stock', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
  { key: 'total_users', label: 'Users', icon: Users, color: 'text-gold-400', bg: 'bg-gold-400/10' },
];

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  processing: 'text-blue-400 bg-blue-400/10',
  shipped: 'text-purple-400 bg-purple-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(({ data: d }) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p className="text-gray-400">Failed to load dashboard</p>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">UK Services store overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-premium p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-2xl font-bold text-white">
              {card.format === 'price' ? formatPrice(data[card.key]) : data[card.key]}
            </p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-gold-400 hover:text-gold-300">View all</Link>
          </div>
          <div className="space-y-3">
            {data.recent_orders?.length === 0 && <p className="text-gray-500 text-sm">No orders yet</p>}
            {data.recent_orders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-dark-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{order.order_number}</p>
                  <p className="text-xs text-gray-500">{order.shipping_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" /> Low Stock Alert
            </h2>
            <Link to="/admin/products?low_stock=true" className="text-xs text-gold-400 hover:text-gold-300">Manage</Link>
          </div>
          <div className="space-y-3">
            {data.low_stock_list?.length === 0 && <p className="text-gray-500 text-sm">All stock levels healthy</p>}
            {data.low_stock_list?.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-2 border-b border-dark-800 last:border-0">
                <div className="flex items-center gap-3">
                  <img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-dark-800" />
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category_name}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Link to="/admin/products" className="card-premium p-5 hover:border-gold-500/30 transition-colors group">
          <Package className="text-gold-400 mb-2" size={24} />
          <p className="font-medium text-white group-hover:text-gold-300">Manage Products</p>
          <p className="text-xs text-gray-500 mt-1">{data.total_products} products · {data.out_of_stock} out of stock</p>
        </Link>
        <Link to="/admin/categories" className="card-premium p-5 hover:border-gold-500/30 transition-colors group">
          <FolderOpen className="text-gold-400 mb-2" size={24} />
          <p className="font-medium text-white group-hover:text-gold-300">Manage Categories</p>
          <p className="text-xs text-gray-500 mt-1">{data.total_categories} categories</p>
        </Link>
      </div>
    </div>
  );
}

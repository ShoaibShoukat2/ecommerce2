import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminOrders, updateAdminOrderStatus } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/currency';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  processing: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    getAdminOrders(params).then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAdminOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Orders</h1>
        <p className="text-gray-400 text-sm">{orders.length} orders</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..."
            className="input-field pl-10 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto text-sm">
          <option value="">All Status</option>
          {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : orders.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No orders found</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }} className="card-premium overflow-hidden">
              <div className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <p className="font-semibold text-white">{order.order_number}</p>
                  <p className="text-sm text-gray-400">{order.shipping_name} · {order.customer}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-white">{formatPrice(order.total)}</p>
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border capitalize cursor-pointer bg-transparent ${statusColors[order.status]}`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-dark-700 p-5 bg-dark-800/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Items</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm py-1.5">
                          <span className="text-gray-300">{item.product_name} × {item.quantity}</span>
                          <span className="text-white">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Shipping</h4>
                      <p className="text-sm text-gray-300">{order.shipping_name}</p>
                      <p className="text-sm text-gray-400">{order.shipping_email} · {order.shipping_phone}</p>
                      <p className="text-sm text-gray-400 mt-1">{order.shipping_address}</p>
                      <p className="text-sm text-gray-400">{order.shipping_city}, {order.shipping_zip}</p>
                      {order.notes && <p className="text-sm text-gray-500 mt-2 italic">Note: {order.notes}</p>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

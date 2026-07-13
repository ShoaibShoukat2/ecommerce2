import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAdminProducts, createAdminProduct, updateAdminProduct,
  deleteAdminProduct, updateProductStock, getAdminCategories,
} from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/currency';

const emptyProduct = {
  name: '', slug: '', description: '', price: '', compare_price: '',
  image_url: '', stock: 100, rating: 4.5, review_count: 0,
  is_featured: false, is_new: false, category: '',
};

export default function AdminProducts() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (searchParams.get('low_stock') === 'true') params.low_stock = 'true';
    getAdminProducts(params)
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { getAdminCategories().then(({ data }) => setCategories(data)); }, []);
  useEffect(() => { load(); }, [search, searchParams]);

  const openCreate = () => { setForm({ ...emptyProduct, category: categories[0]?.id || '' }); setModal('create'); };
  const openEdit = (p) => {
    setForm({ ...p, category: p.category, compare_price: p.compare_price || '' });
    setModal('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category: parseInt(form.category), rating: parseFloat(form.rating) };
    try {
      if (modal === 'create') {
        await createAdminProduct(payload);
        toast.success('Product created!');
      } else {
        await updateAdminProduct(form.id, payload);
        toast.success('Product updated!');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteAdminProduct(id);
      toast.success('Product deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const handleStockChange = async (id, stock) => {
    try {
      await updateProductStock(id, parseInt(stock));
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: parseInt(stock) } : p));
      toast.success('Stock updated');
    } catch { toast.error('Stock update failed'); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Products</h1>
          <p className="text-gray-400 text-sm">{products.length} products</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-10 text-sm"
        />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700 text-gray-400 text-left">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-dark-800" />
                        <div>
                          <p className="font-medium text-white line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{p.category_name}</td>
                    <td className="p-4 text-white font-medium">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        defaultValue={p.stock}
                        min="0"
                        onBlur={(e) => { if (parseInt(e.target.value) !== p.stock) handleStockChange(p.id, e.target.value); }}
                        className={`w-20 bg-dark-800 border rounded-lg px-2 py-1 text-center text-sm ${
                          p.stock === 0 ? 'border-red-500 text-red-400' : p.stock <= 10 ? 'border-yellow-500 text-yellow-400' : 'border-dark-600 text-white'
                        }`}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {p.is_featured && <span className="text-xs bg-gold-500/15 text-gold-400 px-2 py-0.5 rounded-full">Featured</span>}
                        {p.is_new && <span className="text-xs bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full">New</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-gold-400 transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="card-premium p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">{modal === 'create' ? 'Add Product' : 'Edit Product'}</h2>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field text-sm" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category *</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Price (PKR) *</label>
                  <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Compare Price (PKR)</label>
                  <input type="number" step="0.01" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Stock *</label>
                  <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input-field text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Image URL</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm resize-none" />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-gold-500" /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="accent-gold-500" /> New
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary text-sm flex-1 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Product'}
                  </button>
                  <button type="button" onClick={() => setModal(null)} className="btn-outline text-sm">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

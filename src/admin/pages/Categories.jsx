import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

const empty = { name: '', slug: '', description: '', image_url: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminCategories().then(({ data }) => setCategories(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setModal('create'); };
  const openEdit = (c) => { setForm(c); setModal('edit'); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        await createAdminCategory(form);
        toast.success('Category created!');
      } else {
        await updateAdminCategory(form.id, form);
        toast.success('Category updated!');
      }
      setModal(null);
      load();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in it will also be deleted.')) return;
    try {
      await deleteAdminCategory(id);
      toast.success('Category deleted');
      load();
    } catch { toast.error('Cannot delete — category may have products'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="card-premium p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-400 hover:text-gold-400"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{cat.description || 'No description'}</p>
              <span className="text-xs bg-dark-800 text-gray-400 px-2.5 py-1 rounded-full">{cat.product_count} products</span>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}
              className="card-premium p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">{modal === 'create' ? 'Add Category' : 'Edit Category'}</h2>
                <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field text-sm" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Description</label>
                  <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Image URL</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field text-sm" />
                </div>
                <button type="submit" disabled={saving} className="btn-primary w-full text-sm disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

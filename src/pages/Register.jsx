import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/StoreContext';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '', first_name: '', last_name: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const errors = err.response?.data;
      const msg = errors ? Object.values(errors).flat().join(', ') : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-8 md:p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-dark-950" size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Join UK Services</h1>
          <p className="text-gray-400 text-sm mt-2">Create your account and start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Username</label>
            <input name="username" value={form.username} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="input-field pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Confirm Password</label>
            <input type="password" name="password2" value={form.password2} onChange={handleChange} required className="input-field" />
          </div>

          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

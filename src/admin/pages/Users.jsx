import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAdminUsers } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers().then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Users</h1>
        <p className="text-gray-400 text-sm">{users.length} registered users</p>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700 text-gray-400 text-left">
                <th className="p-4 font-medium">Username</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }} className="border-b border-dark-800 hover:bg-dark-800/30">
                  <td className="p-4 font-medium text-white">{u.username}</td>
                  <td className="p-4 text-gray-300">{u.email}</td>
                  <td className="p-4 text-gray-300">{u.first_name} {u.last_name}</td>
                  <td className="p-4">
                    {u.is_staff ? (
                      <span className="text-xs bg-gold-500/15 text-gold-400 px-2.5 py-1 rounded-full">Admin</span>
                    ) : (
                      <span className="text-xs bg-dark-700 text-gray-400 px-2.5 py-1 rounded-full">Customer</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500">{new Date(u.date_joined).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="mx-auto text-gold-400 mb-6" size={72} />
        </motion.div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
          Order Confirmed!
        </h1>
        <p className="text-gray-400 mb-2">Thank you for your purchase.</p>
        <p className="text-gold-400 font-mono text-lg mb-8">{orderNumber}</p>

        <div className="card-premium p-6 mb-8">
          <Package className="mx-auto text-gold-400 mb-3" size={32} />
          <p className="text-gray-300 text-sm">
            Your order is being processed. You'll receive a confirmation email shortly with tracking details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="btn-primary flex items-center justify-center gap-2">
            View Orders <ArrowRight size={18} />
          </Link>
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';

const STORAGE_KEY = 'termsAlertDismissed';

export default function TermsAlert() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm z-[100]"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[calc(100%-2rem)] max-w-lg"
          >
            <div className="card-premium p-6 md:p-8 relative shadow-2xl shadow-black/50 border-gold-500/20">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="text-dark-950" size={22} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white mb-2">
                    Terms & Conditions
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    By accessing and using UKVI Services (ukviservices.com), you agree to our Terms & Conditions,
                    Privacy Policy, Refund & Cancellation Policy, Return & Exchange Policy, and Shipping Policy.
                    Please review these documents before proceeding.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/terms"
                      onClick={dismiss}
                      className="btn-primary text-sm px-5 py-2.5"
                    >
                      Read Full Terms
                    </Link>
                    <button
                      onClick={dismiss}
                      className="btn-outline text-sm px-5 py-2.5"
                    >
                      I Understand
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

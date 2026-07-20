const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptPromise = null;

export function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }
  if (scriptPromise) {
    return scriptPromise;
  }
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(true);
      } else {
        scriptPromise = null;
        reject(new Error('Razorpay SDK not available after load'));
      }
    };
    script.onerror = () => {
      scriptPromise = null; // reset so next attempt retries
      document.body.removeChild(script);
      reject(new Error('Failed to load Razorpay. Check your internet connection.'));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export function openRazorpayCheckout({ keyId, orderId, amount, currency, name, email, phone, onSuccess, onDismiss }) {
  const options = {
    key: keyId,
    amount,
    currency,
    name: name || 'Kryn & Moey',
    description: 'Order Payment',
    order_id: orderId,
    prefill: {
      name: name || '',
      email: email || '',
      contact: phone || '',
    },
    theme: { color: '#C9A227' },
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
  return razorpay;
}

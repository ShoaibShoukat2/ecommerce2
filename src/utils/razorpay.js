const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptPromise = null;

/** Normalize phone for Razorpay (expects +91XXXXXXXXXX for India). */
export function normalizeIndianPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return digits ? `+${digits}` : '';
}

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
      scriptPromise = null;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      reject(new Error('Failed to load Razorpay. Check your internet connection.'));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export function formatRazorpayError(error) {
  if (!error) return 'Payment failed. Please try again.';

  const stepMessages = {
    payment_authentication: 'Bank authentication failed or timed out. Try UPI or another payment method.',
    payment_authorization: 'Payment was declined by your bank. Try a different card or UPI.',
  };

  if (error.step && stepMessages[error.step]) {
    return stepMessages[error.step];
  }

  return error.description || error.reason || 'Payment failed. Please try again.';
}

export function openRazorpayCheckout({ keyId, orderId, name, email, phone, onSuccess, onDismiss, onPaymentFailed }) {
  const options = {
    key: keyId,
    // Amount & currency come from the order created on the server — do not pass separately.
    order_id: orderId,
    name: 'Kryn & Moey',
    description: 'Order Payment',
    prefill: {
      name: name || '',
      email: email || '',
      contact: normalizeIndianPhone(phone),
    },
    theme: { color: '#C9A227' },
    retry: { enabled: true, max_count: 3 },
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
      confirm_close: true,
      backdropclose: false,
    },
  };

  let razorpay;
  try {
    razorpay = new window.Razorpay(options);
  } catch (err) {
    throw new Error('Failed to initialize payment gateway: ' + err.message);
  }

  razorpay.on('payment.failed', (response) => {
    if (onPaymentFailed) {
      onPaymentFailed(response.error);
    }
  });

  razorpay.open();
  return razorpay;
}

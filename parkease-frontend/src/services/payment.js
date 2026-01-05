/**
 * UPI / Manual Payment Service
 * Supports: GPay, PhonePe, Paytm (Simulation)
 */

export const initiatePayment = ({
  amount,
  bookingDetails,
  method, // gpay | phonepe | paytm
  onSuccess,
  onFailure
}) => {

  if (!amount || amount <= 0) {
    onFailure('Invalid payment amount');
    return;
  }

  // Mock UPI IDs (can be college / demo UPI)
  const upiMap = {
    gpay: 'smartparking@okaxis',
    phonepe: 'smartparking@ybl',
    paytm: 'smartparking@paytm'
  };

  const upiId = upiMap[method];

  if (!upiId) {
    onFailure('Unsupported payment method');
    return;
  }

  // Open custom modal / screen (UI handles this)
  onSuccess({
    step: 'SHOW_UPI',
    upiId,
    amount,
    bookingDetails
  });
};

/**
 * Verify Payment (Mock / Backend-ready)
 */
export const verifyPayment = async ({
  transactionId,
  bookingNumber,
  amount
}) => {

  // Basic validation
  if (!transactionId || transactionId.length < 6) {
    return {
      success: false,
      message: 'Invalid Transaction ID'
    };
  }

  // 🔥 Here backend API call can be added later
  // await api.post('/payments/verify', {...})

  return {
    success: true,
    payment: {
      transactionId,
      bookingNumber,
      amount,
      status: 'SUCCESS',
      paidAt: new Date().toISOString()
    }
  };
};
const axios = require('axios');

class PaymentService {
  constructor() {
    this.baseUrl = 'https://client.singpay.ga/api/v1'; // Base URL standard SingPay
  }

  async processPayment(paymentData) {
    try {
      const response = await axios.post(`https://gateway.singpay.ga/v1/74/paiement`, {
        amount: paymentData.amount,
        client_msisdn: paymentData.number,
        reference: paymentData.reference,
        portefeuille: process.env.SINGPAY_WALLET,
        disbursement: process.env.SINGPAY_DISBURSEMENT,
        isTransfer: false
      }, {
        headers: {
          'x-client-id': process.env.SINGPAY_CLIENT_ID,
          'x-client-secret': process.env.SINGPAY_CLIENT_SECRET,
          'x-wallet': process.env.SINGPAY_WALLET,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error processing payment with SingPay:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  }
}

module.exports = new PaymentService();
const https = require('https');

// Your Paystack secret key
const PAYSTACK_SECRET_KEY = 'sk_test_46413f1cae249453d6ea8f27e00499005f1c427d';

/**
 * Verify a Paystack payment transaction
 * @param {string} reference - The transaction reference returned by Paystack
 * @returns {Promise} - Resolves with payment verification data
 */
function verifyPayment(reference) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (error) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

/**
 * Check if payment was successful
 * @param {string} reference - The transaction reference
 */
async function checkPaymentStatus(reference) {
    try {
        const response = await verifyPayment(reference);
        console.log(response, "RESPOnSE")

        if (response.status && response.data.status === 'success') {
            console.log('✅ Payment Successful!');
            console.log('Amount:', response.data.amount / 100, response.data.currency);
            console.log('Customer Email:', response.data.customer.email);
            console.log('Reference:', response.data.reference);
            console.log('Paid At:', response.data.paid_at);
            return {
                success: true,
                data: response.data
            };
        } else {
            console.log('❌ Payment Failed or Pending');
            console.log('Status:', response.data);
            return {
                success: false,
                status: response.data.status
            };
        }
    } catch (error) {
        console.error('Error verifying payment:', error.message);
        throw Error(error.message)
        // return {
        //     success: false,
        //     error: error.message
        // };
    }
}

// Example usage
// const transactionReference = '1763405774945';
// checkPaymentStatus(transactionReference);

// Express.js webhook example (optional)

const express = require('express');
const app = express();

app.use(express.json());

app.get('/paystack/status', async (req, res) => {
    res.send({ success: true, message: "hello" })
})

app.post('/paystack/webhook', async (req, res) => {
    const event = req.body;
    console.log(event, "EVENT")

    // Verify webhook signature for security

    const reference = event.reference;

    // Verify the payment
    const result = await checkPaymentStatus(reference);
    console.log(result, "RESULT")

    if (result.success) {
        // Update your database, send confirmation email, etc.
        console.log('Payment verified via webhook');
    }



    res.send(result);
});

app.listen(3000, () => console.log('Server running on port 3000'));

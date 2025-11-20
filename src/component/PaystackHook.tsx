import { usePaystackPayment } from 'react-paystack';

const config = {
    reference: (new Date()).getTime().toString(),
    email: "norbertmbafrank@gmail.com",
    amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: 'pk_test_c0198a35cd0526b34365d6241d8c218fa33db418',
};

// you can call this function anything
const onSuccess = (reference: any) => {
  // Implementation for whatever you want to do with reference and after success call.
  console.log(reference);
};

// you can call this function anything
const onClose = () => {
  // implementation for  whatever you want to do when the Paystack dialog closed.
  console.log('closed')
}

const PaystackHookExample = () => {
    const initializePayment = usePaystackPayment(config);
    return (
      <div>
          <button onClick={() => {
              initializePayment({
                onSuccess: onSuccess,
                onClose: onClose
              });
          }}>Paystack Hooks Implementation</button>
      </div>
    );
};


export default PaystackHookExample;
import { useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// Initialize with Public Key
initMercadoPago('TEST-e5126467-9165-4d38-a8ea-2d59f4a94968', {
  locale: 'pt-BR'
});

interface CheckoutProps {
  preferenceId: string | null;
  amount: number;
}

const Checkout: React.FC<CheckoutProps> = ({ preferenceId, amount }) => {
  useEffect(() => {
    // Log for debugging
    console.log("Checkout mounted with preferenceId:", preferenceId);
  }, [preferenceId]);

  if (!preferenceId) {
    return <div className="text-center p-4">Loading payment...</div>;
  }

  const customization = {
    paymentMethods: {
      ticket: 'all',
      bankTransfer: 'all',
      creditCard: 'all',
      debitCard: 'all',
      mercadoPago: 'all',
    } as any,
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Payment
        initialization={{
          amount: amount,
          preferenceId: preferenceId,
        }}
        customization={customization}
        onSubmit={async (param) => {
          console.log(param);
        }}
        onReady={() => console.log('Brick ready')}
        onError={(error) => console.log('Brick error', error)}
      />
    </div>
  );
};

export default Checkout;

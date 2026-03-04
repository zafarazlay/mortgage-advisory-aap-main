import { useState } from "react";
import { Button } from "@/components/ui/button";
import { stripePromise } from "@/lib/stripe";

interface CheckoutButtonProps {
  amount: number; // in cents
  quantity?: number;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ amount, quantity = 1 }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/supabase/functions/v1/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: amount, quantity }),
      });
      const data = await res.json();
      if (data.url) {
        const stripe = await stripePromise;
        stripe?.redirectToCheckout({ url: data.url });
      } else {
        console.error("No session url", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} className="bg-green-600 hover:bg-green-700">
      {loading ? "Processing…" : "Pay Now"}
    </Button>
  );
};

export default CheckoutButton;

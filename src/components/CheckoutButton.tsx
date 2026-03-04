import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CheckoutButtonProps {
  amount: number; // in cents
  quantity?: number;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ amount, quantity = 1 }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/supabase/functions/v1/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: amount, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "No checkout session created",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading} 
      className="bg-green-600 hover:bg-green-700"
    >
      {loading ? "Processing…" : "Pay Now"}
    </Button>
  );
};

export default CheckoutButton;

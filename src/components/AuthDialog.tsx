import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: Mode;
}

export default function AuthDialog({ open, onOpenChange, initialMode = "login" }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reset = () => {
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Signup sent", description: "Check your email for confirmation (if applicable)." });
        handleClose();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Logged in", description: "Welcome back!" });
        handleClose();
      }
    } catch (err: any) {
      toast({ title: "Auth error", description: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "signup" ? "Create an account" : "Sign in"}</DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Create an account using your email and a password."
              : "Sign in with your email and password."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4 py-2">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full gap-4">
              <div className="text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {mode === "signup" ? "Sign in" : "Create account"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleClose} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>{mode === "signup" ? "Sign up" : "Log in"}</Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

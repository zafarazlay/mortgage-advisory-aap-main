import { ArrowRight, Calculator } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";

const HeroSection = () => {
  const handlePrimary = () => {
    trackEvent(EVENTS.PRIMARY_CTA_CLICK, { location: "hero" });
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSecondary = () => {
    trackEvent(EVENTS.SECONDARY_CTA_CLICK, { location: "hero" });
    document.querySelector("#calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center" style={{ background: "var(--gradient-hero)" }}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-2xl">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
            Trusted by 10,000+ homeowners
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Smart Mortgage Solutions for{" "}
            <span className="text-gradient-gold">Your Future</span>
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-10 max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Get competitive rates, expert guidance, and a seamless experience from application to closing. Your dream home is closer than you think.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={handlePrimary}
              className="group flex items-center gap-2 rounded-lg bg-gold px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-cta)] hover:bg-gold-dark transition-all"
            >
              Get Pre-Qualified
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleSecondary}
              className="flex items-center gap-2 rounded-lg border border-primary-foreground/20 px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-all"
            >
              <Calculator size={16} />
              Calculate Your Payment
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {["4.9★ Rating", "Licensed in 50 States", "NMLS #123456"].map((badge) => (
              <span key={badge} className="text-xs text-primary-foreground/50 font-medium">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

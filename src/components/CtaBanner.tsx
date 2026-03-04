import { ArrowRight } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";

const CtaBanner = () => (
  <section className="py-20 lg:py-24" style={{ background: "var(--gradient-cta)" }}>
    <div className="container mx-auto px-6 text-center">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-accent-foreground mb-4">
        Ready to Take the Next Step?
      </h2>
      <p className="text-accent-foreground/70 mb-8 max-w-md mx-auto">
        Join thousands who've found their perfect mortgage. Start your journey today.
      </p>
      <button
        onClick={() => {
          trackEvent(EVENTS.PRIMARY_CTA_CLICK, { location: "cta_banner" });
          document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:bg-navy-light transition-colors"
      >
        Start Your Application
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </section>
);

export default CtaBanner;

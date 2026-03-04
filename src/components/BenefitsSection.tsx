import { TrendingDown, Zap, HeadphonesIcon, Eye } from "lucide-react";

const benefits = [
  { icon: TrendingDown, title: "Competitive Rates", desc: "Access rates below the national average with our extensive lender network." },
  { icon: Zap, title: "Fast Approvals", desc: "Get pre-approved in as little as 24 hours with our streamlined process." },
  { icon: HeadphonesIcon, title: "Expert Guidance", desc: "Dedicated loan officers guide you from application to closing day." },
  { icon: Eye, title: "Transparent Process", desc: "No hidden fees, no surprises. Track every step of your loan in real time." },
];

const BenefitsSection = () => (
  <section className="py-20 lg:py-28" style={{ background: "var(--gradient-hero)" }}>
    <div className="container mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">Why Apex</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">
          Why Thousands Trust Us
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((b) => (
          <div key={b.title} className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-5">
              <b.icon size={24} className="text-gold" />
            </div>
            <h3 className="font-display text-lg font-semibold text-primary-foreground mb-2">{b.title}</h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;

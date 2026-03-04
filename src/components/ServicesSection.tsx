import { Home, RefreshCw, UserCheck } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Home Purchase Loans",
    description: "Competitive rates for your new home with flexible terms and fast pre-approval to give you an edge.",
  },
  {
    icon: RefreshCw,
    title: "Refinance Options",
    description: "Lower your monthly payment or tap into equity with streamlined refinancing solutions.",
  },
  {
    icon: UserCheck,
    title: "First-Time Buyer Assistance",
    description: "Specialized programs with lower down payments and expert guidance through every step.",
  },
];

const ServicesSection = () => (
  <section id="services" className="py-20 lg:py-28 bg-background">
    <div className="container mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">Our Services</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
          Mortgage Solutions Tailored to You
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s) => (
          <div
            key={s.title}
            className="group bg-card rounded-xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 border border-border"
          >
            <div className="w-12 h-12 rounded-lg bg-sky-light flex items-center justify-center mb-5">
              <s.icon size={22} className="text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;

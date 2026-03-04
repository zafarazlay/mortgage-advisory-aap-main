import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "First-Time Homebuyer",
    text: "Apex made buying my first home stress-free. The team walked me through every step and secured an incredible rate.",
    stars: 5,
  },
  {
    name: "James & Linda K.",
    role: "Refinance Client",
    text: "We saved over $400/month on our mortgage after refinancing with Apex. The process was fast and completely transparent.",
    stars: 5,
  },
  {
    name: "Michael R.",
    role: "Investment Property",
    text: "Professional, responsive, and genuinely focused on finding the best deal. Highly recommend for any mortgage needs.",
    stars: 5,
  },
];

const TestimonialsSection = () => (
  <section className="py-20 lg:py-28 bg-secondary">
    <div className="container mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">Testimonials</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
          What Our Clients Say
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-card rounded-xl p-8 shadow-[var(--shadow-card)] border border-border">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.stars }).map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
            <div>
              <p className="font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-muted-foreground text-xs">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;

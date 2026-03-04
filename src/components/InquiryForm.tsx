import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";

const InquiryForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "purchase",
    credit: "",
    message: "",
  });

  const update = (key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.email.trim() || !form.email.includes("@")) errs.email = true;
    if (!form.phone.trim()) errs.phone = true;

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    trackEvent(EVENTS.FORM_SUBMITTED, { purpose: form.purpose });
    setSubmitted(true);
  };

  const inputClass = (key: string) =>
    `w-full rounded-lg border ${errors[key] ? "border-destructive" : "border-input"} bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body`;
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  if (submitted) {
    return (
      <section id="contact" className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle size={48} className="text-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">Application Received!</h2>
            <p className="text-muted-foreground">Thank you for your inquiry. A loan specialist will contact you within 24 hours.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">Get Started</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Start Your Application
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] border border-border space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass("name")} placeholder="John Smith" />
            </div>
            <div>
              <label className={labelClass}>Email Address *</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass("email")} placeholder="john@email.com" />
            </div>
            <div>
              <label className={labelClass}>Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass("phone")} placeholder="(555) 123-4567" />
            </div>
            <div>
              <label className={labelClass}>Loan Purpose</label>
              <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)} className={inputClass("purpose")}>
                <option value="purchase">Home Purchase</option>
                <option value="refinance">Refinance</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Estimated Credit Score</label>
              <select value={form.credit} onChange={(e) => update("credit", e.target.value)} className={inputClass("credit")}>
                <option value="">Select Range</option>
                <option value="excellent">Excellent (750+)</option>
                <option value="good">Good (700-749)</option>
                <option value="fair">Fair (650-699)</option>
                <option value="below">Below 650</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass("message")} placeholder="Tell us about your goals..." />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gold px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-cta)] hover:bg-gold-dark transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </section>
  );
};

export default InquiryForm;

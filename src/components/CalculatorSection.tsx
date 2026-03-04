import { useState, useMemo } from "react";
import { trackEvent, EVENTS } from "@/lib/analytics";

const CalculatorSection = () => {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(3000);
  const [insurance, setInsurance] = useState(1200);
  const [hasTracked, setHasTracked] = useState(false);

  const results = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    let monthlyPrincipal = 0;

    if (r > 0) {
      monthlyPrincipal = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthlyPrincipal = loanAmount / n;
    }

    const monthlyTax = propertyTax / 12;
    const monthlyIns = insurance / 12;
    const totalMonthly = monthlyPrincipal + monthlyTax + monthlyIns;
    const totalPayment = totalMonthly * n;
    const totalInterest = totalPayment - loanAmount - propertyTax * loanTerm - insurance * loanTerm;

    if (!hasTracked) {
      trackEvent(EVENTS.CALCULATOR_USED);
      setHasTracked(true);
    }

    return {
      monthly: totalMonthly,
      totalInterest: totalInterest > 0 ? totalInterest : 0,
      totalPayment,
    };
  }, [loanAmount, interestRate, loanTerm, propertyTax, insurance, hasTracked]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">Calculator</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Estimate Your Monthly Payment
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Inputs */}
            <div className="md:col-span-3 p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Loan Amount</label>
                  <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Interest Rate (%)</label>
                  <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Loan Term (Years)</label>
                  <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(+e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Property Tax (Annual)</label>
                  <input type="number" value={propertyTax} onChange={(e) => setPropertyTax(+e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="max-w-[calc(50%-0.625rem)]">
                <label className={labelClass}>Insurance (Annual)</label>
                <input type="number" value={insurance} onChange={(e) => setInsurance(+e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-2 p-8 flex flex-col justify-center" style={{ background: "var(--gradient-hero)" }}>
              <div className="text-center">
                <p className="text-primary-foreground/60 text-sm mb-2">Monthly Payment</p>
                <p className="font-display text-4xl font-bold text-primary-foreground mb-6">
                  {fmt(results.monthly)}
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-foreground/60">Total Interest</span>
                    <span className="text-primary-foreground font-medium">{fmt(results.totalInterest)}</span>
                  </div>
                  <div className="h-px bg-primary-foreground/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-foreground/60">Total Payment</span>
                    <span className="text-primary-foreground font-medium">{fmt(results.totalPayment)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;

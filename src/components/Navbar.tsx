import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";
import AuthDialog from "@/components/AuthDialog";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Calculator", href: "#calculator" },
  { label: "Contact", href: "#contact" },
];

// auth dialog state
const Navbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <button onClick={() => handleNavClick("#home")} className="font-display text-xl font-bold text-primary">
          Apex<span className="text-gold">Mortgage</span>
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => handleNavClick(l.href)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {l.label}
              </button>
            </li>
          ))}

          {/* auth buttons */}
          <li>
            <button
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Login
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setAuthMode("signup");
                setAuthOpen(true);
              }}
              className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              Sign Up
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                trackEvent(EVENTS.PRIMARY_CTA_CLICK, { location: "nav" });
                handleNavClick("#contact");
              }}
              className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-cta)] hover:bg-gold-dark transition-colors"
            >
              Apply Now
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-6 pb-6">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => handleNavClick(l.href)}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                }}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Login
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setAuthOpen(true);
                }}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Sign Up
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  trackEvent(EVENTS.PRIMARY_CTA_CLICK, { location: "mobile_nav" });
                  handleNavClick("#contact");
                }}
                className="w-full rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-cta)] hover:bg-gold-dark transition-colors"
              >
                Apply Now
              </button>
            </li>
          </ul>
        </div>
      )}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
    </header>
  );
};

export default Navbar;

const Footer = () => (
  <footer className="bg-primary py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="font-display text-lg font-bold text-primary-foreground">
            Apex<span className="text-gold">Mortgage</span>
          </p>
          <p className="text-primary-foreground/50 text-xs mt-1">NMLS #123456 | Equal Housing Lender</p>
        </div>
        <div className="flex gap-8">
          {["Privacy Policy", "Terms of Service", "Disclosures"].map((l) => (
            <a key={l} href="#" className="text-primary-foreground/50 text-xs hover:text-primary-foreground/80 transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center">
        <p className="text-primary-foreground/40 text-xs">© 2026 ApexMortgage. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

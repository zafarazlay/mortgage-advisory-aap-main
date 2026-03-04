import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CalculatorSection from "@/components/CalculatorSection";
import InquiryForm from "@/components/InquiryForm";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import MortgageChatbot from "@/components/MortgageChatbot";
import LandbotWidget from "@/components/LandbotWidget";
import CheckoutButton from "@/components/CheckoutButton";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CalculatorSection />
        <InquiryForm />
        <CtaBanner />
        {/* example checkout button: $10.00 */}
        <div className="p-6 text-center">
          <CheckoutButton amount={1000} />
        </div>
      </main>
      <Footer />
      <MortgageChatbot />
      <LandbotWidget />
    </>
  );
};

export default Index;

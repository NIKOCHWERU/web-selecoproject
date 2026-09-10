import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import RetainerSection from '@/components/RetainerSection';
import TeamSection from '@/components/TeamSection';
import InsightsSection from '@/components/InsightsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <RetainerSection />
      <TeamSection />
      <InsightsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}

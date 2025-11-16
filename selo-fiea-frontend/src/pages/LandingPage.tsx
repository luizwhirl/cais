// selo-fiea-frontend/src/pages/LandingPage.tsx

import { AboutSection } from "../components/AboutSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { ProcessSection } from "../components/ProcessSection";

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <BenefitsSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

export default App
import { HeroSection } from "@/components/marketing/hero-section";
import { MarketCapitalSection } from "@/components/marketing/market-capital-section";
import { IntelligenceLoopSection } from "@/components/marketing/intelligence-loop-section";
import { AgentPreviewSection } from "@/components/marketing/agent-preview-section";
import { PerformanceProofSection } from "@/components/marketing/performance-proof-section";
import { ArenaSection } from "@/components/marketing/arena-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <MarketCapitalSection />
      <IntelligenceLoopSection />
      <AgentPreviewSection />
      <PerformanceProofSection />
      <ArenaSection />
      <FinalCtaSection />
    </>
  );
}

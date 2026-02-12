import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { FeatureDetailSection } from '@/components/sections/FeatureDetailSection';
import { ScreenshotsSection } from '@/components/sections/ScreenshotsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { DownloadSection } from '@/components/sections/DownloadSection';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeatureDetailSection />
      <ScreenshotsSection />
      <TeamSection />
      <DownloadSection />
      <CTASection />
    </>
  );
}

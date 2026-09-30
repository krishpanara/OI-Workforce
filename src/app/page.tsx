'use client';
import { useState } from 'react';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Header from '@/components/layout/Header';
import DotNav from '@/components/layout/DotNav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import OrgProblem from '@/components/sections/OrgProblem';
import ProductScreenshots from '@/components/sections/ProductScreenshots';
import Ingestion from '@/components/sections/Ingestion';
import Integrations from '@/components/sections/Integrations';
import KnowledgeBank from '@/components/sections/KnowledgeBank';
import CapacityReport from '@/components/sections/CapacityReport';
import Flow from '@/components/sections/Flow';
import Consultants from '@/components/sections/Consultants';
import UseCases from '@/components/sections/UseCases';
import PeopleIntel from '@/components/sections/PeopleIntel';
import Trust from '@/components/sections/Trust';
import GLIF from '@/components/sections/GLIF';
import Hardware from '@/components/sections/Hardware';
import ClientProof from '@/components/sections/ClientProof';
import Legal from '@/components/sections/Legal';
import FAQ from '@/components/sections/FAQ';
import ClosingCTA from '@/components/sections/ClosingCTA';
import GroupStrip from '@/components/sections/GroupStrip';
import DavidModal from '@/components/interactive/DavidModal';
import Lightbox from '@/components/interactive/Lightbox';
import { useRevealObserver } from '@/hooks/useRevealObserver';

export default function Home() {
  const [davidOpen, setDavidOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  useRevealObserver();

  return (
    <>
      <ScrollProgress />
      <Header />
      <DotNav />
      <main>
        <Hero onMeetOI={() => setDavidOpen(true)} />
        <OrgProblem />
        <ProductScreenshots />
        <Ingestion />
        <Integrations />
        <KnowledgeBank />
        <CapacityReport onMeetOI={() => setDavidOpen(true)} />
        <Flow />
        <Consultants />
        <UseCases />
        <PeopleIntel />
        <Trust />
        <GLIF />
        <Hardware />
        <ClientProof />
        <Legal />
        <FAQ />
        <ClosingCTA onMeetOI={() => setDavidOpen(true)} />
        <GroupStrip />
      </main>
      <Footer />
      <DavidModal isOpen={davidOpen} onClose={() => setDavidOpen(false)} />
      <Lightbox src={lightboxSrc} open={!!lightboxSrc} onClose={() => setLightboxSrc('')} />
    </>
  );
}

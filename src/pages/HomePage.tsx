import { lazy } from 'react';
import DeferredSection from '../components/DeferredSection';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CoupleSection from '../components/CoupleSection';
import StorySection from '../components/StorySection';
import CountdownSection from '../components/CountdownSection';
import EventsSection from '../components/EventsSection';
import GuestbookSection from '../components/GuestbookSection';
import GiftBoxSection from '../components/GiftBoxSection';
import Footer from '../components/Footer';
import QuickActions from '../components/QuickActions';

const AlbumSection = lazy(() => import('../components/AlbumSection'));

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <CoupleSection />
        <StorySection />
        <CountdownSection />
        <DeferredSection id="album">
          <AlbumSection />
        </DeferredSection>
        <EventsSection />
        <GuestbookSection />
        <GiftBoxSection />
      </main>
      <Footer />
      <QuickActions />
    </>
  );
}

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CoupleSection from '../components/CoupleSection';
import StorySection from '../components/StorySection';
import CountdownSection from '../components/CountdownSection';
import AlbumSection from '../components/AlbumSection';
import EventsSection from '../components/EventsSection';
import GuestbookSection from '../components/GuestbookSection';
import GiftBoxSection from '../components/GiftBoxSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CoupleSection />
        <StorySection />
        <CountdownSection />
        <AlbumSection />
        <EventsSection />
        <GuestbookSection />
        <GiftBoxSection />
      </main>
      <Footer />
    </>
  );
}

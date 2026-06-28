import { Metadata } from 'next';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePageClient from '@/components/HomePageClient';

// SEO Metadata following guidelines
export const metadata: Metadata = {
  title: 'Royal Sports Club | Shuttle Badminton Academy Ettumanoor, Kottayam',
  description: 'Join Ettumanoor\'s premier sports organization. Certified professional coaching in Shuttle Badminton, Football, Cricket, and Tennis under Kottayam District Badminton Association guidelines.',
  keywords: 'sports club Ettumanoor, badminton coaching Kottayam, badminton academy Kerala, sports training Ettumanoor, turf football Kottayam, KDBSA affiliation, cricket coaching Kerala',
  openGraph: {
    title: 'Royal Sports Club | Shuttle Badminton Academy Ettumanoor, Kottayam',
    description: 'Join Ettumanoor\'s premier sports organization. Elite shuttle badminton coaching, turf football training, and flexible membership programs.',
    type: 'website',
  }
};

export default async function Page() {
  // Parallel server-side data fetching for optimal performance and SEO
  const [
    sports,
    coaches,
    news,
    plans,
    gallery,
    clubDetails
  ] = await Promise.all([
    api.getSports(),
    api.getCoaches(),
    api.getNews(),
    api.getPlans(),
    api.getGallery(),
    api.getClubDetails()
  ]);

  return (
    <>
      <Header 
        phone={clubDetails?.phone} 
        email={clubDetails?.email} 
      />
      <main className="flex-1">
        <HomePageClient
          initialSports={sports}
          initialCoaches={coaches}
          initialNews={news}
          initialPlans={plans}
          initialGallery={gallery}
          initialClubDetails={clubDetails}
        />
      </main>
      <Footer
        address={clubDetails?.address}
        phone={clubDetails?.phone}
        email={clubDetails?.email}
      />
    </>
  );
}

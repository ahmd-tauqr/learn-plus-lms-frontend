import Hero from '@/components/Hero';
import homeImg from 'public/home.jpg';

export default function Home() {
  return <Hero imageData={homeImg} imageAlt='car factory' title='Learn Plus' />;
}

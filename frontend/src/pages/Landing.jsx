import React from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import GalleryPreview from '../components/Gallery/GalleryPreview';
import Footer from '../components/Footer/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Hero />
      <Features />
      <GalleryPreview />
      <Footer />
    </div>
  );
};

export default Landing;
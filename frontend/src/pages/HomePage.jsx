import React from 'react';
import HeroSection from '../components/HeroSection';
import LatestReviews from '../components/LatestReviews';
import Newsletter from '../components/Newsletter';
import TrendingSection from '../components/TrendingSection';

const HomePage = ({ onOpenModal }) => {
  return (
    <>
      <HeroSection />
      <TrendingSection onOpenModal={onOpenModal} /> 
      <LatestReviews />
      <Newsletter />
    </>
  );
};

export default HomePage;
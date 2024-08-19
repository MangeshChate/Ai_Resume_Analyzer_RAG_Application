import React from 'react'
import RoboResumeAnalyzer from './components/RoboResumeAnalyzer'

import "rabbitcss"
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeatureSection'
import Footer from './components/Footer'
const App = () => {
  return (
    <div className=''>
      <Navbar />
      <HeroSection />
      <RoboResumeAnalyzer />
      <FeaturesSection />
      <Footer/>
    </div>
  )
}

export default App

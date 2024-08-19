import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className=" py-20">
    <div className="max-w-6xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-4"
      >
        Effortlessly Analyze Your Resume
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-8"
      >
        Upload your resume and get instant, personalized feedback on your strengths and areas for improvement.
      </motion.p>
     
    </div>
  </section>
);

export default HeroSection

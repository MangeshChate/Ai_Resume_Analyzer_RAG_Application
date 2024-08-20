import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="bg-blue-500 text-white py-16 px-6 sm:px-8 lg:px-12 mb-3 shadow-2xl">
    <div className="max-w-4xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight"
      >
        Effortlessly Analyze Your Resume
      </motion.h2>
     </div>
  </section>
);

export default HeroSection;
